import { toast } from "sonner";
import qs from "qs";
import { m } from "@/paraglide/messages.js";
import { getAccessToken, getRefreshToken, logout, setTokens } from "@/features/auth/session";

/** The error body this client understands: a message (`error`, or DummyJSON's `message`), and per-field messages. */
interface ApiErrorBody {
  error?: string;
  message?: string;
  errors?: Record<string, string | string[]>;
}

export class ApiError extends Error {
  /** Field name → first message, from the body's `errors`. Forms show them with `applyApiFieldErrors`. */
  fieldErrors?: Record<string, string>;

  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(`Request failed with status ${status}`);
    const errors = (data as ApiErrorBody | undefined)?.errors;
    if (errors && typeof errors === "object") {
      this.fieldErrors = Object.fromEntries(
        Object.entries(errors).map(([field, message]) => [field, Array.isArray(message) ? message[0] : message]),
      );
    }
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  params?: object;
  body?: unknown;
  /** Skip the error toast, for callers that show the error themselves. */
  silent?: boolean;
}

const baseUrl = import.meta.env.VITE_API_URL ?? "";

// One refresh at a time: requests that fail together wait for the same one. True once there are new tokens.
let refreshing: Promise<boolean> | null = null;
const refreshTokens = () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(false);

  // The API's refresh endpoint: the refresh token in, new tokens out (DummyJSON's shape).
  refreshing ??= fetch(`${baseUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      if (!response.ok) return false;
      setTokens(await response.json());
      return true;
    })
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
};

/**
 * fetch wrapper: base URL, 30s timeout, Bearer token, JSON in/out, error toast. A 401 gets new tokens with the
 * refresh token and sends the request again, once (`retried`); if that fails, it logs out.
 */
export async function api<T = unknown>(path: string, options: ApiOptions = {}, retried = false): Promise<T> {
  const { params, body, headers, signal, silent, ...init } = options;
  const query = qs.stringify(params, { arrayFormat: "brackets", encodeValuesOnly: true, skipNulls: true });
  const isJson = body !== undefined && !(body instanceof FormData);

  const requestHeaders = new Headers(headers);
  const token = getAccessToken();
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  if (isJson) requestHeaders.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}${query ? `?${query}` : ""}`, {
      ...init,
      headers: requestHeaders,
      body: isJson ? JSON.stringify(body) : (body as BodyInit | undefined),
      signal: AbortSignal.any([AbortSignal.timeout(30_000), ...(signal ? [signal] : [])]),
    });
  } catch (error) {
    // Network error or timeout; a caller-initiated abort (e.g. react-query cancel) stays silent.
    if (!signal?.aborted && !silent) toast.error(m.something_went_wrong());
    throw error;
  }

  const data = response.headers.get("content-type")?.includes("json") ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new ApiError(response.status, data);

    if (response.status === 401) {
      if (!retried && (await refreshTokens())) return api<T>(path, options, true);
      logout();
    } else if (!silent && !error.fieldErrors) {
      // Field errors show on the form's fields instead.
      const errorBody = data as ApiErrorBody | undefined;
      toast.error(errorBody?.error || errorBody?.message || m.something_went_wrong());
    }

    throw error;
  }

  return data as T;
}

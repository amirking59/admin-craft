import { toast } from "sonner";
import qs from "qs";
import { m } from "@/paraglide/messages.js";
import { getAccessToken, logout } from "@/features/auth/services";

/** The error body this client understands: a message, and per-field messages for forms. */
interface ApiErrorBody {
  error?: string;
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

/** fetch wrapper: base URL, 30s timeout, Bearer token, JSON in/out, 401 → logout, error toast. */
export async function api<T = unknown>(
  path: string,
  { params, body, headers, signal, silent, ...init }: ApiOptions = {},
) {
  const query = qs.stringify(params, { arrayFormat: "brackets", encodeValuesOnly: true, skipNulls: true });
  const isJson = body !== undefined && !(body instanceof FormData);

  const requestHeaders = new Headers(headers);
  const token = getAccessToken();
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  if (isJson) requestHeaders.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${import.meta.env.VITE_API_URL ?? ""}${path}${query ? `?${query}` : ""}`, {
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
      logout();
    } else if (!silent && !error.fieldErrors) {
      // Field errors show on the form's fields instead.
      toast.error((data as ApiErrorBody | undefined)?.error || m.something_went_wrong());
    }

    throw error;
  }

  return data as T;
}

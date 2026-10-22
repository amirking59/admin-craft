import { LocalStorage } from "@/lib/storage";
import { toast } from "sonner";
import i18n from "i18next";
import qs from "qs";
import { logout } from "@/features/auth/services";

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(`Request failed with status ${status}`);
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  params?: object;
  body?: unknown;
}

/** fetch wrapper: base URL, 30s timeout, Bearer token, JSON in/out, 401 → logout, error toast. */
export async function api<T = unknown>(path: string, { params, body, headers, signal, ...init }: ApiOptions = {}) {
  const query = qs.stringify(params, { arrayFormat: "brackets", encodeValuesOnly: true, skipNulls: true });
  const isJson = body !== undefined && !(body instanceof FormData);

  const requestHeaders = new Headers(headers);
  const token = LocalStorage.getItem("accessToken");
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
    if (!signal?.aborted) toast.error(i18n.t("somethingWentWrong"));
    throw error;
  }

  const data = response.headers.get("content-type")?.includes("json") ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      logout();
    } else {
      toast.error((data as { error?: string } | undefined)?.error || i18n.t("somethingWentWrong"));
    }

    throw new ApiError(response.status, data);
  }

  return data as T;
}

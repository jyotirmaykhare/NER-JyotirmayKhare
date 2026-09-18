import { ApiResponse } from "@/types/api";

/**
 * Browser-side API client for the unified `/api/*` surface.
 *
 * Every call is same-origin (served by the Next.js route handlers / rewrites),
 * which keeps the FastAPI origin and all API credentials server-side. Requests
 * are bounded by a timeout so a sleeping backend can never freeze the UI, and
 * every service pairs a call with a curated offline dataset.
 */

export const DEFAULT_TIMEOUT_MS = 6000;

export class ApiError extends Error {
  readonly status?: number;
  readonly path: string;

  constructor(message: string, path: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.path = path;
    this.status = status;
  }
}

export type ApiResult<T> =
  | { ok: true; data: T; engineSource?: string }
  | { ok: false; error: string };

async function request<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<{ data: T; engineSource?: string }> {
  const response = await fetch(path, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, path, response.status);
  }

  const engineSource = response.headers.get("X-NER-Source") || undefined;

  try {
    return { data: (await response.json()) as T, engineSource };
  } catch {
    throw new ApiError("Response body was not valid JSON", path, response.status);
  }
}

/** GET helper that resolves with an `ApiResult` instead of throwing. */
export async function apiGet<T>(path: string, timeoutMs?: number): Promise<ApiResult<T>> {
  try {
    const { data, engineSource } = await request<T>(path, { method: "GET" }, timeoutMs);
    return { ok: true, data, engineSource };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/** POST helper that resolves with an `ApiResult` instead of throwing. */
export async function apiPost<T>(
  path: string,
  payload: unknown,
  timeoutMs?: number
): Promise<ApiResult<T>> {
  try {
    const { data, engineSource } = await request<T>(
      path,
      { method: "POST", body: JSON.stringify(payload) },
      timeoutMs
    );
    return { ok: true, data, engineSource };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/**
 * Calls an endpoint and falls back to a curated dataset when the API layer is
 * unavailable or returns an unusable payload.
 *
 * The route handlers tag every response with `X-NER-Source`, so a handler that
 * had to use its own offline dataset is reported as `fallback` rather than
 * masquerading as live engine data.
 */
export async function apiWithFallback<T>(
  call: () => Promise<ApiResult<T>>,
  fallback: () => T | Promise<T>,
  isUsable: (data: T) => boolean = () => true
): Promise<ApiResponse<T>> {
  const result = await call();

  if (result.ok && isUsable(result.data)) {
    const servedOffline = result.engineSource === "offline-fallback";

    return {
      data: result.data,
      source: servedOffline ? "fallback" : "live",
      provider: result.engineSource,
    };
  }

  return {
    data: await fallback(),
    source: "fallback",
    provider: "client-fallback",
    error: result.ok ? "API returned an unusable payload" : result.error,
  };
}

function describeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.name === "TimeoutError") return "Request timed out";
  if (error instanceof Error) return error.message;
  return String(error);
}

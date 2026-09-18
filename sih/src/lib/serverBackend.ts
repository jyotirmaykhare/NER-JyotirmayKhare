/**
 * Server-side bridge to the unified FastAPI engine in `sih/backend/`.
 *
 * Design: route handlers are the single client-facing API surface (`/api/*`).
 * Each handler prefers the FastAPI engine and degrades to a curated offline
 * dataset when the engine is unreachable — this keeps the NER-LIFELINE
 * blackout-resilience guarantee while never exposing backend credentials or
 * the backend origin to the browser.
 *
 * Server-side only: never import this module from a client component.
 */

export const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

/** Upstream budget per request. Kept short so a dead engine never stalls the UI. */
export const BACKEND_TIMEOUT_MS = Number(process.env.BACKEND_TIMEOUT_MS || 3500);

/** Set `BACKEND_ENABLED=false` to force every handler onto curated offline data. */
export function isBackendEnabled(): boolean {
  return process.env.BACKEND_ENABLED !== "false";
}

export function backendUrl(path: string): string {
  return `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Calls the FastAPI engine and returns parsed JSON, or `null` when the engine is
 * disabled, slow, erroring, unreachable or returns a non-JSON body.
 */
export async function fetchBackendJson<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs: number = BACKEND_TIMEOUT_MS
): Promise<T | null> {
  if (!isBackendEnabled()) return null;

  try {
    const response = await fetch(backendUrl(path), {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(init.headers || {}),
      },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;

    return (await response.json()) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[api] FastAPI engine unavailable at ${backendUrl(path)} (${reason})`);
    return null;
  }
}

/** Convenience wrapper for POST endpoints with a JSON body. */
export function postBackendJson<T>(
  path: string,
  payload: unknown,
  timeoutMs?: number
): Promise<T | null> {
  return fetchBackendJson<T>(
    path,
    { method: "POST", body: JSON.stringify(payload) },
    timeoutMs
  );
}

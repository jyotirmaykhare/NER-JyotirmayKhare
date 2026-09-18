import { apiGet, apiWithFallback } from "@/lib/apiClient";
import { BackendHealthResponse, FleetResponse } from "@/types/api";
import { buildOfflineFleet } from "@/data/fleetFallback";

/**
 * AIS-140 fleet registry client.
 *
 * Live telemetry is served by the FastAPI registry (`/api/vehicles`); the
 * client-side convoy simulation remains the offline fallback.
 */

export async function getFleet(): Promise<FleetResponse & { live: boolean }> {
  const response = await apiWithFallback<FleetResponse>(
    () => apiGet<FleetResponse>("/api/vehicles"),
    () => buildOfflineFleet(),
    (payload) => Array.isArray(payload?.vehicles) && payload.vehicles.length > 0
  );

  return { ...response.data, live: response.source === "live" };
}

export interface ApiLayerStatus {
  reachable: boolean;
  status: string;
  latencyMs?: number;
  supabaseConfigured?: boolean;
}

/** Probes the API layer so the UI can label live vs offline operation. */
export async function getApiLayerStatus(): Promise<ApiLayerStatus> {
  const result = await apiGet<{
    status: string;
    backend?: { reachable?: boolean; latency_ms?: number; supabase_configured?: boolean };
  }>("/api/health", 3000);

  if (!result.ok) {
    return { reachable: false, status: "unreachable" };
  }

  return {
    reachable: Boolean(result.data?.backend?.reachable),
    status: result.data?.status ?? "unknown",
    latencyMs: result.data?.backend?.latency_ms,
    supabaseConfigured: result.data?.backend?.supabase_configured,
  };
}

export type { BackendHealthResponse };

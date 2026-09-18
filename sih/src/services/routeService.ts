import { apiGet, apiPost, apiWithFallback } from "@/lib/apiClient";
import {
  AlternateRouteRequest,
  AlternateRouteResponse,
  ApiResponse,
  BlockageInfo,
  GoogleRouteRequest,
  GoogleRouteResponse,
} from "@/types/api";
import {
  BLOCKAGE_FALLBACK,
  buildVoiceAnnouncement,
  getFallbackAlternate,
} from "@/data/blockages";

/**
 * Corridor, blockage and detour client.
 *
 * All three feeds are served by the FastAPI geospatial engine through the
 * `/api/*` route handlers; curated datasets keep routing usable offline.
 */

export async function getBlockages(): Promise<ApiResponse<BlockageInfo[]>> {
  return apiWithFallback<BlockageInfo[]>(
    () => apiGet<BlockageInfo[]>("/api/routes/blockages"),
    () => BLOCKAGE_FALLBACK,
    (list) => Array.isArray(list) && list.length > 0
  );
}

export async function getAlternateRoute(
  request: AlternateRouteRequest
): Promise<ApiResponse<AlternateRouteResponse>> {
  const blockageId = request.blocked_road_id ?? null;

  return apiWithFallback<AlternateRouteResponse>(
    () => apiPost<AlternateRouteResponse>("/api/routes/alternate", request),
    () => {
      const alternate = getFallbackAlternate(blockageId);

      return {
        blocked: true,
        blockage_details: null,
        primary_route_status: "BLOCKED / IMPASSABLE",
        ai_alternate_route: alternate,
        ai_advisory:
          "Offline detour advisory: corridor geometry served from the surveyed National Highway dataset.",
        recommended_action:
          "Apply the AI bypass detour and notify the regional control room.",
        voice_announcement: buildVoiceAnnouncement(blockageId, alternate),
      } satisfies AlternateRouteResponse;
    },
    (payload) => Boolean(payload?.ai_alternate_route?.navigation_steps)
  );
}

/**
 * Computes a corridor between two coordinates.
 *
 * Returns `null` when neither the API layer nor the surveyed fallback could
 * provide geometry, letting callers keep their existing static corridor.
 */
export async function computeCorridor(
  request: GoogleRouteRequest
): Promise<ApiResponse<GoogleRouteResponse | null>> {
  const result = await apiPost<GoogleRouteResponse>("/api/v1/routes/google", request);

  if (result.ok && result.data?.route?.coordinates?.length) {
    return { data: result.data, source: "live" };
  }

  return {
    data: null,
    source: "fallback",
    error: result.ok ? "Route payload missing geometry" : result.error,
  };
}
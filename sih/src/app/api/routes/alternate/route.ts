import { NextRequest, NextResponse } from "next/server";
import { postBackendJson } from "@/lib/serverBackend";
import { getFallbackAlternate, buildVoiceAnnouncement } from "@/data/blockages";
import type { AlternateRouteResponse, AlternateRouteRequest } from "@/types/api";

/**
 * AI alternate detour computation.
 *
 * The FastAPI engine evaluates hazard deltas, fuel margins and surveyed valley
 * bypass corridors. If it is unreachable, the curated detour set is returned so
 * operators can still apply an AI bypass mid-blackout.
 */
export async function POST(req: NextRequest) {
  let body: AlternateRouteRequest = {};

  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const blockageId = body.blocked_road_id || "blk-1";

  const engineResult = await postBackendJson<AlternateRouteResponse>("/api/routes/alternate", {
    origin_hub_id: body.origin_hub_id ?? "guwahati",
    destination_hub_id: body.destination_hub_id ?? "tawang",
    blocked_road_id: blockageId,
    blockage_lat: body.blockage_lat,
    blockage_lng: body.blockage_lng,
    vehicle_id: body.vehicle_id,
    weather_condition: body.weather_condition ?? "Monsoon Rain",
  });

  if (engineResult?.ai_alternate_route) {
    return NextResponse.json(engineResult, {
      headers: { "X-NER-Source": "fastapi-engine" },
    });
  }

  const alternate = getFallbackAlternate(blockageId);

  const fallback: AlternateRouteResponse = {
    blocked: true,
    blockage_details: null,
    primary_route_status: "BLOCKED / IMPASSABLE",
    ai_alternate_route: alternate,
    ai_advisory:
      "Offline detour advisory: corridor geometry served from the surveyed National Highway dataset. Verify ground conditions with the local BRO post before convoy release.",
    recommended_action: "Apply the AI bypass detour and notify the regional control room.",
    voice_announcement: buildVoiceAnnouncement(blockageId, alternate),
  };

  return NextResponse.json(fallback, {
    headers: { "X-NER-Source": "offline-fallback" },
  });
}


import { NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/serverBackend";
import { buildOfflineFleet, normalizeEngineFleet } from "@/data/fleetFallback";

/**
 * AIS-140 fleet registry.
 *
 * The FastAPI engine owns the authoritative server-side registry (incl. the
 * realtime tracking stream) and models vehicles in its own fuel/terrain shape,
 * so the payload is normalised before it reaches the UI. When the engine is
 * unreachable the curated convoy dataset is served instead.
 */
export async function GET() {
  const enginePayload = await fetchBackendJson<unknown>("/api/vehicles");
  const normalised = normalizeEngineFleet(enginePayload);

  if (normalised) {
    return NextResponse.json(normalised, {
      headers: { "X-NER-Source": "fastapi-engine" },
    });
  }

  return NextResponse.json(buildOfflineFleet(), {
    headers: { "X-NER-Source": "offline-fallback" },
  });
}
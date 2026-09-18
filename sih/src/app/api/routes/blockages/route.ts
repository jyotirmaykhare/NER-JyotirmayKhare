import { NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/serverBackend";
import { BLOCKAGE_FALLBACK } from "@/data/blockages";
import type { BlockageInfo } from "@/types/api";

/**
 * Active highway blockage register.
 *
 * Served by the FastAPI geospatial engine when reachable; otherwise the curated
 * offline blockage set is returned so the AI Blockage Reroute modal always has
 * obstruction data during network blackouts.
 */
export async function GET() {
  const engineBlockages = await fetchBackendJson<BlockageInfo[]>("/api/routes/blockages");

  if (Array.isArray(engineBlockages) && engineBlockages.length > 0) {
    return NextResponse.json(engineBlockages, {
      headers: { "X-NER-Source": "fastapi-engine" },
    });
  }

  return NextResponse.json(BLOCKAGE_FALLBACK, {
    headers: { "X-NER-Source": "offline-fallback" },
  });
}


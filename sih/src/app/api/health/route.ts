import { NextResponse } from "next/server";
import { BACKEND_URL, backendUrl, fetchBackendJson, isBackendEnabled } from "@/lib/serverBackend";
import type { BackendHealthResponse } from "@/types/api";

/**
 * API layer health probe.
 *
 * Reports whether the unified FastAPI engine is reachable so operators (and the
 * deployment pipeline) can distinguish "live telemetry" from "offline dataset"
 * mode. Never returns credentials — only booleans.
 */
export async function GET() {
  const startedAt = Date.now();

  const engine = await fetchBackendJson<BackendHealthResponse>("/api/health", {}, 2000);
  const latencyMs = Date.now() - startedAt;

  const secretsConfigured = {
    google_routes: Boolean(process.env.GOOGLE_ROUTES_API_KEY || process.env.GOOGLE_MAPS_API_KEY),
    serp_api: Boolean(process.env.SERP_API_KEY),
    supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  };

  if (engine) {
    return NextResponse.json({
      status: "ok",
      api_layer: "route-handlers",
      backend: {
        enabled: isBackendEnabled(),
        reachable: true,
        url: BACKEND_URL,
        latency_ms: latencyMs,
        service: engine.service ?? "NER-LIFELINE Backend API",
        supabase_configured: engine.supabase_configured ?? secretsConfigured.supabase,
      },
      credentials_configured: secretsConfigured,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    {
      status: "degraded",
      api_layer: "route-handlers",
      backend: {
        enabled: isBackendEnabled(),
        reachable: false,
        url: BACKEND_URL,
        probe_url: backendUrl("/api/health"),
        latency_ms: latencyMs,
        note: "FastAPI engine unreachable — /api/* endpoints are serving curated offline datasets.",
      },
      credentials_configured: secretsConfigured,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
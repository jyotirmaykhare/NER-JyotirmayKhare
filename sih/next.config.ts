import type { NextConfig } from "next";

/**
 * FastAPI endpoints that have no local route handler are proxied transparently
 * to the unified backend engine (`sih/backend/main.py`).
 *
 * Handlers that DO exist locally (chat, routes/blockages, routes/alternate,
 * vahan/verify, vehicles, places, health) always win, because Next.js resolves
 * filesystem routes before applying rewrites — which is what keeps the offline
 * fallback behaviour intact.
 */
const ENGINE_PROXY_PATHS = [
  "/api/shipments",
  "/api/routes/risk-index",
  "/api/routes/optimize",
  "/api/routes/blockage/toggle",
  "/api/incidents",
  "/api/mesh/nodes",
  "/api/mesh/telemetry",
  "/api/vehicles/realtime",
  "/api/vehicles/search",
  "/api/vehicles/stream",
  "/api/gps/update",
  "/api/gps/latest",
  "/api/gps/history",
  "/api/roads/histories",
  "/api/telemetry/ais140/status",
  "/api/sos/call",
  "/api/database/sync",
  "/api/vahan/vehicles",
  "/api/vahan/sync-database",
  "/api/vahan/register-vehicle",
  "/api/languages",
];

const backendOrigin = (
  process.env.BACKEND_URL ||
  process.env.API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    // `BACKEND_ENABLED=false` keeps the app fully self-contained (offline/preview mode).
    if (process.env.BACKEND_ENABLED === "false") {
      return [];
    }

    return ENGINE_PROXY_PATHS.flatMap((path) => [
      { source: path, destination: `${backendOrigin}${path}` },
      { source: `${path}/:path*`, destination: `${backendOrigin}${path}/:path*` },
    ]);
  },
};

export default nextConfig;

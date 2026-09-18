# PHASE 2 REPORT — API Layer Integration

**Date**: 2026-09-18
**Phase**: 2 — API Layer
**Base**: sih/ (Next.js 16.3.4 App Router — authoritative)
**Source**: NER FastAPI engine (imported into `sih/backend/`)
**Status**: COMPLETED

---

## 1. Architecture Implemented

A single client-facing API surface with a **BFF (backend-for-frontend)** shape:

```text
Browser  →  /api/*  (Next.js route handlers, same-origin)
                │  1. try  ─────────────►  FastAPI engine (sih/backend, :8000)
                │                              ├─► Google Routes API v2 (server-side key)
                │                              └─► Supabase PostgreSQL
                └─ 2. fallback ────────►  curated offline datasets (src/data/*)
```

* The browser **only** ever calls same-origin `/api/*`. No backend origin, no API key and
  no Supabase credential reaches the client bundle.
* Every handler returns an `X-NER-Source` provenance header (`fastapi-engine`,
  `offline-fallback`, `cache`). The client reads it, so the UI can honestly label
  **LIVE ENGINE** vs **OFFLINE DATASET** instead of fabricating liveness.
* Endpoints with no local handler are proxied to the engine by `next.config.ts` rewrites
  (`BACKEND_URL`, default `http://127.0.0.1:8000`). Filesystem routes win over rewrites,
  so the offline fallback of the 8 implemented handlers is preserved.
* `BACKEND_ENABLED=false` disables both the proxy and the engine calls, making the app
  fully self-contained for previews/offline demos.

---

## 2. Files Created

### Shared contracts & infrastructure
| File | Purpose |
| :--- | :--- |
| `src/types/api.ts` | Typed mirrors of the FastAPI Pydantic models (`ChatResponse`, `BlockageInfo`, `AlternateRouteResponse`, `RouteAlternative`, `NavigationStep`, `VahanRecord`, `FleetRegistryItem`, `GoogleRouteResponse`, …). |
| `src/lib/serverBackend.ts` | Server-only bridge: `BACKEND_URL`, `BACKEND_TIMEOUT_MS`, `fetchBackendJson`, `postBackendJson`. Never throws — returns `null` on timeout/error so handlers degrade deterministically. |
| `src/lib/apiClient.ts` | Browser client: timeout-bounded `apiGet`/`apiPost`, `ApiError`, `apiWithFallback`, `X-NER-Source` provenance parsing. |
| `src/app/api/health/route.ts` | API layer probe: engine reachability + latency, configured-credential booleans (never values). |

### Services (single entry point per domain — no duplicate layers)
| File | Purpose |
| :--- | :--- |
| `src/services/chatService.ts` | `sendCopilotMessage`, suggestion catalogue, offline knowledge fallback. |
| `src/services/routeService.ts` | `getBlockages`, `getAlternateRoute`, `computeCorridor`. |
| `src/services/vahanService.ts` | `verifyRegistration(plate)` → live certificate or curated offline register. |
| `src/services/fleetService.ts` | `getFleet()`, `getApiLayerStatus()`. |

### Shared fallback datasets (defined exactly once)
| File | Purpose |
| :--- | :--- |
| `src/data/blockages.ts` | Curated blockage register + AI detour alternatives typed as the real contracts + `buildVoiceAnnouncement`. |
| `src/data/vahan.ts` | Curated MoRTH register, deterministic offline verification (removed the original `Math.random()` permit number). |
| `src/data/fleetFallback.ts` | `normalizeEngineVehicle`/`normalizeEngineFleet` (engine → UI shape adapters) + `buildOfflineFleet`. |

### Configuration templates
| File | Purpose |
---

## 3. Files Modified

| File | Change |
| :--- | :--- |
| `next.config.ts` | Rewrites proxy 21 engine paths to `BACKEND_URL`; disabled by `BACKEND_ENABLED=false`. |
| `src/app/api/chat/route.ts` | Engine-first; local 8-entry NER knowledge base + math engine as offline fallback. |
| `src/app/api/chat/suggestions/route.ts` | Engine-first; curated catalogue fallback. |
| `src/app/api/routes/blockages/route.ts` | Engine-first (richer live register); curated blockages fallback. |
| `src/app/api/routes/alternate/route.ts` | Engine-first; curated detour fallback. The old handler returned `diversion_name`, which the modal **never rendered** (it reads `ai_alternate_route.distance_km`) — the contract mismatch is fixed by using the real `AlternateRouteResponse` shape. |
| `src/app/api/v1/routes/google/route.ts` | Engine-first (key stays server-side); surveyed NH corridor synthesis + 5-minute TTL cache. |
| `src/app/api/vahan/verify/[plate]/route.ts` | Engine-first; curated offline register fallback. |
| `src/app/api/vehicles/route.ts` | Engine-first with shape normalisation; offline convoy fleet fallback. |
| `src/app/api/places/route.ts` | SerpApi key now read **server-side only** (dropped `NEXT_PUBLIC_*` fallbacks that leaked it). |
| `src/components/modals/AiCopilotModal.tsx` | Uses `chatService`; bubbles show LIVE ENGINE / OFFLINE KB provenance. |
| `src/components/modals/VehicleDossierModal.tsx` | Uses `vahanService`; typed record (no `any`), race-safe fetch, VERIFYING/LIVE/OFFLINE badge. |
| `src/components/modals/AIBlockageRerouteModal.tsx` | 88-line duplicate dataset removed; loads live blockages + computes detours on selection; renders the engine's voice announcement; provenance badge. |
| `src/components/views/RoutesView.tsx` | "Find Route" queries the corridor engine and shows distance/ETA/composite risk. |
| `src/components/views/VehiclesView.tsx` | Registry status driven by `/api/vehicles` instead of a hardcoded "146 Active Convoys". |
| `sih/.gitignore` | Re-allows `.env.example` / `backend/.env.example` templates. |

---

## 4. Per-API As-Built Matrix

| API | Provider | Route / Handler | Engine path | Auth / Env | Error handling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Corridor routes** | Google Routes API v2 (via engine) | `POST /api/v1/routes/google` | `POST /api/v1/routes/google` | `GOOGLE_ROUTES_API_KEY` (server only) | Engine → surveyed corridor synthesis (Haversine × 1.35 curvature, 38 km/h convoy); 5-min TTL cache; 400 on invalid coords |
| **Road blockages** | NER geospatial engine | `GET /api/routes/blockages` | `GET /api/routes/blockages` | none | Curated 3-blockage register |
| **AI detours** | NER detour engine | `POST /api/routes/alternate` | `POST /api/routes/alternate` | none | Curated detour + `voice_announcement`; malformed body → defaults to `blk-1` |
| **AI copilot** | NER chatbot engine | `POST /api/chat` | `POST /api/chat` | none | 8-entry local KB → math engine → operational guidance; 500 only on malformed JSON |
| **Chat suggestions** | NER chatbot engine | `GET /api/chat/suggestions` | `GET /api/chat/suggestions` | none | Curated 4-category catalogue |
| **VAHAN 4.0** | Supabase / local cache (via engine) | `GET /api/vahan/verify/{plate}` | `GET /api/vahan/verify/{plate}` | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Curated register + deterministic generic record; 400 on empty plate |
| **Fleet registry** | AIS-140 engine registry | `GET /api/vehicles` | `GET /api/vehicles` | none | Shape-normalised engine telemetry → offline convoy dataset (5) |
| **Amenities** | SerpApi Google Maps | `GET /api/places` | — (client-side provider) | `SERP_API_KEY` (server only) | Curated NER places dataset; 3.5 s timeout |
| **Engine passthrough** | NER engine | rewrites | `/api/shipments`, `/api/routes/optimize`, `/api/incidents`, `/api/mesh/*`, `/api/vehicles/realtime`, `/api/gps/*`, `/api/sos/call*`, `/api/database/sync`, `/api/languages`, `/ws/*` | per-endpoint | Engine error surfaces as-is (no fabricated data) |

### Environment strategy (as built)

* **Frontend (`sih/.env.local`)**: `BACKEND_URL`, `BACKEND_ENABLED`, `BACKEND_TIMEOUT_MS` only.
  No credential is prefixed `NEXT_PUBLIC_`.
* **Backend (`sih/backend/.env`)**: `GOOGLE_ROUTES_API_KEY` / `GOOGLE_MAPS_API_KEY`,
  `SUPABASE_URL` / `SUPABASE_ANON_KEY`, `SERP_API_KEY`, `ALLOWED_ORIGINS`, `SOS_RECEIVER_PHONE`.
* The engine reads its credentials server-side; the Next.js handlers read `SERP_API_KEY`
  server-side. Absent credentials simply select the offline dataset — no hardcoded keys anywhere.
| :--- | :--- |
| `sih/.env.example` | `BACKEND_URL`, `BACKEND_ENABLED`, `BACKEND_TIMEOUT_MS` + server-only credential placeholders. |
| `sih/backend/.env.example` | Engine config (routes/maps/serp/supabase/origins). Replaces NER's template that shipped a **real Firebase API key**. |

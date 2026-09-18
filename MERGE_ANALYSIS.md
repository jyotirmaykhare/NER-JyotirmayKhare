# MERGE ANALYSIS — sih × NER → Unified App

**Date**: 2026-09-17
**Phase**: 0 — Audit (Read-Only)
**Status**: AUDIT COMPLETE

---

## 1. Architecture Summary

### 1A. sih/ (BASE — Authoritative)

| Dimension         | Details                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **Framework**     | Next.js 16.3.4, App Router, React 19.2.8, TypeScript                   |
| **Styling**       | Tailwind CSS v4 + clsx + tailwind-merge                                |
| **Routing**       | SPA: single `page.tsx` switches views via `activeTab` Context state     |
| **State Mgmt**    | Single monolithic React Context (`AppContext.tsx`)                      |
| **Database**      | None — all data is hardcoded mock datasets in `src/data/`              |
| **Backend**       | None — empty `backend/` and `frontend/` scaffolding dirs exist         |
| **Maps**          | Leaflet 1.9.4 (tile rendering) + SerpApi (places search, mock fallback)|
| **Charts**        | Recharts 3.10.1                                                        |
| **Auth**          | Mocked — demo users from static list, no real provider                 |
| **Icons**         | lucide-react 1.42.0                                                    |
| **Build/Dev**     | `npm run dev` (next dev), `npm run build` (next build)                 |
| **TypeScript**    | Yes — strict mode, path aliases (`@/*`)                                |
| **Code Splitting**| None — all 12 views imported statically in `page.tsx`                  |

**Key Strengths**: Rich SPA UI with 12 operational views, Leaflet-based interactive maps, offline field report support, emergency ops workflow, multi-language support (translations), well-typed TypeScript, notification system, driver HUD mode.

### 1B. NER/ (SOURCE — Import Selectively)

| Dimension         | Details                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **Framework**     | Vite 8.2.2, React 19.2.8, JSX (no TypeScript)                         |
| **Styling**       | Tailwind CSS v4 via `@tailwindcss/vite`                                |
| **Routing**       | react-router-dom 7.18.3 — URL-based routes with nested layouts         |
| **State Mgmt**    | React Context (AuthContext, LanguageContext, ThemeContext — separate)    |
| **Database**      | Supabase (PostgreSQL) via Python SDK, with in-memory fallback          |
| **Backend**       | FastAPI (Python) — 3,300+ line `main.py`, Uvicorn ASGI server         |
| **Maps**          | ArcGIS tile layers (public), Google Routes API (server-side)           |
| **Auth**          | Firebase Auth (Google OAuth + Email/Password), in-memory persistence   |
| **Icons**         | lucide-react 1.43.0                                                    |
| **Build/Dev**     | `npm run dev` (vite), `npm run build` (vite build), `npm run backend`  |
| **TypeScript**    | No — plain JSX                                                         |
| **Code Splitting**| Yes — React `lazy` + `Suspense` with `lazyWithRetry` recovery         |

**Key Strengths**: Real Firebase auth with RBAC, real FastAPI backend with 40+ endpoints, Supabase DB integration, Google Routes API with server-side key protection, WebSocket real-time data (GPS, vehicles, SOS calls), AI chatbot engine, security middleware (rate limiting, CSP, IP blocking), code splitting, role-based route guards with session timeout.

---

## 2. Feature Comparison Table

| Area                    | sih (BASE)                                   | NER (SOURCE)                                    | Decision                                              |
|-------------------------|----------------------------------------------|--------------------------------------------------|-------------------------------------------------------|
| **Framework**           | Next.js 16.3.4 + TypeScript                 | Vite + React (JSX)                               | **Keep sih** — SSR-capable, TypeScript, App Router    |
| **Routing**             | SPA tab-switch (`activeTab` in Context)      | react-router-dom URL routes                      | **Migrate to Next.js App Router** file-based routes   |
| **State Management**    | Single monolithic `AppContext`               | Separate contexts (Auth/Language/Theme)           | **Keep sih pattern, split into domains**              |
| **Maps (Rendering)**    | Leaflet tiles (OpenStreetMap)                | ArcGIS tile server (Esri)                         | **Keep Leaflet** (sih baseline, OSS, no API key)     |
| **Maps (Places)**       | SerpApi search + mock fallback               | N/A                                               | **Keep sih** — convert env var to `NEXT_PUBLIC_`      |
| **Maps (Routing)**      | None                                         | Google Routes API (server-side, cached)           | **Import from NER** — server-side key protection      |
| **Weather**             | Static mock data in views                    | Not implemented                                   | **Keep sih mock** — add real API later                |
| **AI/Chatbot**          | AI Copilot modal (UI shell, no real backend) | Full chatbot engine (domain knowledge + fallback) | **Import NER backend** chatbot, wire to sih modal     |
| **Backend**             | None (empty scaffolding)                     | FastAPI 40+ endpoints, WebSockets, security       | **Import NER backend** wholesale                      |
| **Database**            | None (mock data)                             | Supabase PostgreSQL + in-memory fallback          | **Import NER** Supabase integration                   |
| **Auth**                | Mocked demo users                            | Firebase Auth (Google + Email/Password)           | **Import NER** Firebase auth (fix startup latency)    |
| **Route Guards**        | UI sidebar tab hiding by role                | `ProtectedRoute` with RBAC + session timeout      | **Import NER** RBAC pattern, adapt to Next.js         |
| **Code Splitting**      | None (all views static imports)              | React.lazy + Suspense + retry                     | **Add Next.js `dynamic()`** to sih views              |
| **Error Boundary**      | None                                         | `ErrorBoundary` component                         | **Import from NER**                                   |
| **Theme Support**       | Dark mode only (hardcoded slate-950)         | ThemeContext with toggle                          | **Import NER** theme system                           |
| **i18n / Language**     | Full translations system (`TRANSLATIONS`)    | LanguageContext (separate impl)                   | **Keep sih** translations, merge if NER adds langs    |
| **Offline Mode**        | Full offline field reports + sync            | None                                              | **Keep sih** — critical feature                       |
| **Emergency Ops**       | Full emergency session flow                  | SOS call engine (WebSocket)                       | **Keep sih UI + import NER** SOS backend              |
| **Analytics/Charts**    | Recharts-powered analytics view              | Analytics page (lighter)                          | **Keep sih** Recharts implementation                  |
| **Security Middleware** | None                                         | Rate limiting, CSP, IP blocking, CSRF nonce       | **Import NER** security stack                         |
| **Real-time Data**      | 6s GPS jitter simulation (client-side)       | WebSocket GPS + vehicle telemetry (server-side)   | **Import NER** WebSocket approach, keep sih fallback  |
| **Notifications**       | Toast system in AppContext                   | None (console only)                               | **Keep sih** notification system                      |
| **Driver HUD**          | Full HUD overlay view                        | DriverDashboard page                              | **Keep sih** HUD, evaluate NER's dashboard            |
| **Vehicle Registry**    | Mock fleet data                              | MoRTH VAHAN 4.0 integration (Supabase)           | **Import NER** VAHAN backend                          |

---

## 3. Dependency Comparison

### 3A. Frontend Dependencies

| Package               | sih Version    | NER Version    | Action                                    |
|------------------------|---------------|----------------|-------------------------------------------|
| react                  | 19.2.8        | ^19.2.8        | Same — keep                               |
| react-dom              | 19.2.8        | ^19.2.8        | Same — keep                               |
| next                   | 16.3.4        | —              | Keep (sih framework)                      |
| react-router-dom       | —             | ^7.18.3        | **Remove** — replaced by Next.js routing  |
| firebase               | —             | ^12.19.0       | **Add to sih** for auth                   |
| leaflet                | ^1.9.4        | —              | Keep (sih maps)                           |
| @types/leaflet         | ^1.9.22       | —              | Keep                                      |
| recharts               | ^3.10.1       | —              | Keep (sih charts)                         |
| lucide-react           | ^1.42.0       | ^1.43.0        | **Bump to ^1.43.0**                       |
| clsx                   | ^2.1.1        | —              | Keep                                      |
| tailwind-merge         | ^3.6.0        | —              | Keep                                      |
| tailwindcss            | ^4            | ^4.3.3         | Keep (compatible)                         |
| typescript             | ^5            | —              | Keep (sih uses TS)                        |

### 3B. Backend Dependencies (NER only → import as-is)

| Package         | Version       | Purpose                                 |
|-----------------|---------------|-----------------------------------------|
| fastapi         | >=0.115.0     | API framework                           |
| uvicorn         | >=0.30.0      | ASGI server                             |
| supabase        | >=2.8.0       | PostgreSQL client                       |
| pydantic        | >=2.8.0       | Request/response validation             |
| python-dotenv   | >=1.0.1       | Environment variable loading            |

---

## 4. API Inventory & Diff

### 4A. External APIs (Outbound)

| API                      | sih                                              | NER                                                        | Merged Plan                                          |
|--------------------------|--------------------------------------------------|-------------------------------------------------------------|------------------------------------------------------|
| **Google Maps Places**   | SerpApi (`serpapi.com/search.json?engine=google_maps`) | N/A                                                   | Keep — move key to `NEXT_PUBLIC_SERP_API_KEY`        |
| **Google Routes API**    | N/A                                              | `routes.googleapis.com/directions/v2:computeRoutes` (backend) | Import — env var `GOOGLE_ROUTES_API_KEY`             |
| **ArcGIS Tiles**         | N/A                                              | Public tile URLs (no auth)                                  | Optional import — Leaflet already has OSM tiles      |
| **Firebase Auth**        | N/A                                              | Firebase SDK (client-side)                                  | Import — env vars `NEXT_PUBLIC_FIREBASE_*`           |
| **Supabase DB**          | N/A                                              | Python SDK (`supabase.create_client`)                       | Import — env vars `SUPABASE_URL`, `SUPABASE_ANON_KEY`|
| **Wikipedia API**        | N/A                                              | `en.wikipedia.org/api/rest_v1` (chatbot fallback)           | Import with backend                                  |

### 4B. Internal API Endpoints (NER Backend → Import)

| Category           | Endpoints (key)                                                   | Notes                              |
|--------------------|-------------------------------------------------------------------|------------------------------------|
| Shipments          | `GET/POST /api/shipments`                                         | CRUD + mock fallback               |
| Route Risk         | `GET /api/routes/risk-index`                                      | Risk assessment engine             |
| Incidents          | `GET/POST /api/incidents`                                         | Hazard reporting                   |
| Mesh Network       | `GET /api/mesh/nodes`, `/api/mesh/telemetry`                      | LoRa mesh simulation               |
| Vehicles           | `GET /api/vehicles`, `/api/vehicles/search`, SSE stream           | Fleet management                   |
| Google Routes      | `POST /api/v1/routes/google`                                      | Server-side route computation      |
| GPS                | `POST /api/gps/update`, `GET /api/gps/latest`, `WS /ws/gps`      | Real-time tracking                 |
| Road Histories     | `GET /api/roads/histories`, `GET .../events`                      | Historical risk data               |
| Vehicle Realtime   | `GET/POST /api/vehicles/realtime`, `WS /ws/vehicles/realtime`     | AIS-140 telemetry                  |
| SOS Calls          | `POST /api/sos/call/initiate`, heartbeat, end, WS                 | Emergency dispatch                 |
| VAHAN Registry     | `GET /api/vahan/vehicles`, verify, sync                           | MoRTH integration                  |
| AI Chatbot         | `POST /api/chat`, `GET /api/chat/suggestions`                     | Domain-aware AI engine             |
| Route Blockages    | `GET /api/routes/blockages`, alternate, toggle                    | Dynamic rerouting                  |
| Polyglot           | `POST /api/languages/generate`, validate                          | Code generation engine             |

---

## 5. Authentication Analysis

### 5A. sih Auth (Current)
- **Type**: Mocked demo authentication
- **Flow**: User selects a role → `login(role)` sets `currentUser` from `DEMO_USERS` static list
- **Guards**: Sidebar hides tabs based on role, but no real enforcement
- **Session**: React state only — no persistence, no tokens
- **Verdict**: Placeholder only. Needs real auth.

### 5B. NER Auth (To Import & Fix)
- **Type**: Firebase Auth (Google OAuth popup + Email/Password)
- **SDK**: Modular Firebase v12 (`firebase/auth`)
- **Init**: `services/firebase.js` — config priority: localStorage → env vars → hardcoded fallback
- **Persistence**: `inMemoryPersistence` enforced — **every browser refresh kills the session**
- **Listeners**: **NO `onAuthStateChanged`** — relies solely on `signInWithPopup` promise result
- **Route Guards**: `ProtectedRoute` with role checking, session timeout (30 min), auth state integrity validation
- **Role Storage**: `sessionStorage` + `localStorage` (key: `ner_lifeline_user_role`)
- **Logout**: `signOut(auth)` + clear all storage

### 5C. Auth Issues to Fix During Migration

| Issue                                           | Severity | Fix Plan                                                      |
|-------------------------------------------------|----------|---------------------------------------------------------------|
| **No `onAuthStateChanged`** listener            | HIGH     | Add listener to persist session across refreshes              |
| **`inMemoryPersistence`** kills session on reload | HIGH   | Switch to `browserLocalPersistence` or `browserSessionPersistence` |
| **Hardcoded Firebase config** in `firebase.js`  | MEDIUM   | Move to env vars only, remove fallback config                 |
| **Hardcoded Google API key** in `main.py:1096`  | HIGH     | Remove fallback, use env var only                             |
| **Firebase config in `.env.example`** with real values | MEDIUM | Replace with placeholder values                           |
| **`localStorage` config override** (`saveFirebaseConfig`) | LOW | Remove — config should come from env only              |
| **Session timeout only in ProtectedRoute**      | LOW      | Acceptable pattern, keep                                      |

---

## 6. Environment Variables — Unified Strategy

### 6A. Proposed Unified `.env.example`

```env
# === Frontend (Next.js — prefix with NEXT_PUBLIC_) ===
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_SERP_API_KEY=your_serpapi_key

# === Backend (Python FastAPI — no prefix) ===
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_ROUTES_API_KEY=your_google_routes_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
SOS_RECEIVER_PHONE=+91_your_number
```

### 6B. Env Var Migration Map

| Current Var (sih)                    | Current Var (NER)                    | Final Var                              |
|--------------------------------------|--------------------------------------|----------------------------------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`    | —                                    | `NEXT_PUBLIC_SERP_API_KEY`             |
| `VITE_MAPS_API_KEY`                  | —                                    | `NEXT_PUBLIC_SERP_API_KEY`             |
| —                                    | `VITE_FIREBASE_API_KEY`              | `NEXT_PUBLIC_FIREBASE_API_KEY`         |
| —                                    | `VITE_FIREBASE_AUTH_DOMAIN`          | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`     |
| —                                    | `VITE_FIREBASE_PROJECT_ID`           | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`      |
| —                                    | `VITE_FIREBASE_STORAGE_BUCKET`       | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  |
| —                                    | `VITE_FIREBASE_MESSAGING_SENDER_ID`  | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| —                                    | `VITE_FIREBASE_APP_ID`               | `NEXT_PUBLIC_FIREBASE_APP_ID`          |
| —                                    | `GOOGLE_MAPS_API_KEY`                | `GOOGLE_MAPS_API_KEY` (backend)        |
| —                                    | `GOOGLE_ROUTES_API_KEY`              | `GOOGLE_ROUTES_API_KEY` (backend)      |
| —                                    | `SUPABASE_URL`                       | `SUPABASE_URL` (backend)               |
| —                                    | `SUPABASE_ANON_KEY`                  | `SUPABASE_ANON_KEY` (backend)          |
| `WEATHER_API_KEY`                    | —                                    | `WEATHER_API_KEY` (backend, future)    |
| `OPENAI_API_KEY`                     | —                                    | `OPENAI_API_KEY` (backend, future)     |

---

## 7. Conflicting / Overlapping Files

| Concern                                    | sih File(s)                             | NER File(s)                                      | Resolution                                        |
|--------------------------------------------|-----------------------------------------|--------------------------------------------------|---------------------------------------------------|
| **Root page / App shell**                  | `src/app/page.tsx`                      | `frontend/src/App.jsx`                           | Keep sih, port NER routing to Next.js App Router  |
| **State context**                          | `src/context/AppContext.tsx`            | `frontend/src/context/AuthContext.jsx` + others   | Keep sih context, add Auth/Theme contexts from NER|
| **Login component**                        | `src/components/modals/LoginModal.tsx`  | `frontend/src/pages/Login.jsx`                   | Merge: sih modal UI + NER Firebase auth logic     |
| **Map rendering**                          | `src/components/map/LeafletMap.tsx`     | `frontend/src/pages/LiveMap.jsx` (ArcGIS)        | Keep sih Leaflet, import NER's routing overlays   |
| **Vehicle management**                     | `src/components/views/VehiclesView.tsx` | `frontend/src/pages/Vehicles.jsx`                | Keep sih, wire to NER backend                     |
| **Shipment tracking**                      | `src/components/views/ShipmentsView.tsx`| `frontend/src/pages/Shipments.jsx`               | Keep sih, wire to NER backend                     |
| **Alerts**                                 | `src/components/views/AlertsView.tsx`   | `frontend/src/pages/Alerts.jsx`                  | Keep sih, wire to NER backend                     |
| **Incidents**                              | Mock data only                          | `frontend/src/pages/Incidents.jsx`               | Keep sih view, wire to NER backend                |
| **AI assistant**                           | `src/components/modals/AiCopilotModal.tsx` | `frontend/src/pages/AIAssistant.jsx`          | Keep sih modal UI, wire to NER chatbot backend    |
| **Analytics**                              | `src/components/views/AnalyticsView.tsx` (Recharts) | `frontend/src/pages/Analytics.jsx`     | Keep sih (Recharts), supplement with NER data     |
| **Driver view**                            | `src/components/views/DriverHudView.tsx`| `frontend/src/pages/DriverDashboard.jsx`         | Keep sih HUD overlay                              |
| **Icons**                                  | lucide-react 1.42                       | lucide-react 1.43                                | Bump to 1.43                                      |

---

## 8. Migration Manifest

### 8A. Keep from sih (preserve working behavior)

- `src/app/layout.tsx` — Next.js root layout
- `src/app/page.tsx` — main SPA shell (will refactor to App Router routes)
- `src/app/globals.css` — global styles
- `src/components/layout/` — Header, Sidebar, MobileNav, LandingModal
- `src/components/views/` — All 12 view components
- `src/components/modals/` — LoginModal, AiCopilotModal, IdentityVerificationModal
- `src/components/map/` — LeafletMap
- `src/components/ui/` — StatCard, StatusBadge, RiskIndicator
- `src/context/AppContext.tsx` — global state (will split later)
- `src/data/` — mock datasets (roads, vehicles, shipments, incidents, emergency, translations)
- `src/lib/googleMapsApi.ts` — SerpApi integration with mock fallback
- `src/types/` — TypeScript type definitions
- `package.json` — Next.js dependencies
- `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`

### 8B. Import from NER (adapt to sih architecture)

| What                          | NER Source                                    | Target in Merged App                         |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| Firebase auth service         | `frontend/src/services/firebase.js`           | `src/lib/firebase.ts` (convert to TS)        |
| AuthContext                   | `frontend/src/context/AuthContext.jsx`         | `src/context/AuthContext.tsx`                |
| ProtectedRoute                | `frontend/src/components/auth/ProtectedRoute.jsx` | `src/components/auth/ProtectedRoute.tsx` |
| Role config                   | `frontend/src/constants/roles.js`              | `src/constants/roles.ts`                    |
| ThemeContext                  | `frontend/src/context/ThemeContext.jsx`         | `src/context/ThemeContext.tsx`               |
| ErrorBoundary                 | `frontend/src/components/common/ErrorBoundary.jsx` | `src/components/common/ErrorBoundary.tsx`|
| TacticalLoader                | `frontend/src/components/common/TacticalLoader.jsx` | `src/components/common/TacticalLoader.tsx`|
| **Entire backend/**          | `backend/` (main.py, database.py, chatbot.py, security.py, schemas.py, polyglot_service.py, transport_ministry_service.py, vehicle_database.py, sdk/) | `backend/` (as-is, Python) |
| Frontend services (selective) | `frontend/src/services/` (chatService.js, gpsService.js, sosService.js, realtimeTrackingService.js, roadVehicleService.js, googleDirectionsService.js, fuelRouteService.js, apiSecurity.js, aiVoiceService.js) | `src/services/` (convert to TS, adapt for Next.js) |
| Google Map View component    | `frontend/src/components/GoogleMapView.jsx`    | Evaluate — may merge with sih LeafletMap      |
| AI Blockage Reroute Modal    | `frontend/src/components/AIBlockageRerouteModal.jsx` | `src/components/modals/AIBlockageRerouteModal.tsx` |
| Vehicle Dossier Modal        | `frontend/src/components/VehicleDossierModal.jsx` | `src/components/modals/VehicleDossierModal.tsx` |
| AI Chat Widget               | `frontend/src/components/AIChatWidget.jsx`     | Evaluate vs sih AiCopilotModal               |
| Google Account Chooser       | `frontend/src/components/auth/GoogleAccountChooserModal.jsx` | `src/components/auth/GoogleAccountChooserModal.tsx` |
| Vite build config (reference) | `frontend/vite.config.js`                     | Reference only — use Next.js config          |

### 8C. Rewrite / Adapt

| Item                        | Current State                                  | Needed Work                                       |
|-----------------------------|------------------------------------------------|---------------------------------------------------|
| Routing architecture        | SPA tab-switch                                 | Convert to Next.js App Router file-based routes   |
| Firebase config loading     | `import.meta.env.VITE_*` + hardcoded fallback  | `process.env.NEXT_PUBLIC_*` only, no hardcoding   |
| Auth persistence            | `inMemoryPersistence` (session dies on reload)  | `browserLocalPersistence` + `onAuthStateChanged`  |
| Login modal                 | sih: demo user selection                       | Merge: keep sih UI, add Firebase Google + email   |
| API calls from frontend     | sih: direct SerpApi from client                | Route through Next.js API routes or backend proxy |
| Code splitting              | sih: none                                      | Add `next/dynamic` for heavy views                |
| Context splitting           | sih: one monolithic context                    | Split into Auth, App, Theme, Language contexts    |

### 8D. Remove

| Item                                    | Reason                                                    |
|-----------------------------------------|-----------------------------------------------------------|
| `sih/backend/` (empty Express scaffold) | Empty scaffolding, replaced by NER FastAPI backend        |
| `sih/frontend/` (empty Vite scaffold)   | Empty scaffolding, main app is the Next.js root           |
| `sih/docker-compose.yml`               | References unused MongoDB, will need rewrite              |
| NER hardcoded Firebase config fallback  | Security concern — use env vars only                      |
| NER hardcoded Google API key fallback   | Security concern — use env vars only                      |
| NER `react-router-dom` dependency       | Replaced by Next.js App Router                            |
| NER `lazyWithRetry` + infinite reload   | Replaced by Next.js built-in code splitting               |
| NER `inMemoryPersistence` enforcement   | Replaced by proper persistent auth                        |

---

## 9. Performance Concerns

| Concern                                        | Repo   | Severity | Fix Plan                                             |
|-------------------------------------------------|--------|----------|------------------------------------------------------|
| All 12 views statically imported (no splitting) | sih    | HIGH     | Add `next/dynamic` with loading skeletons            |
| Monolithic `AppContext` re-renders everything   | sih    | HIGH     | Split into domain-specific contexts                  |
| 6s `setInterval` GPS jitter simulation          | sih    | MEDIUM   | Replace with WebSocket data from NER backend         |
| `inMemoryPersistence` forces re-login on reload | NER    | HIGH     | Switch to `browserLocalPersistence`                  |
| No `onAuthStateChanged` — auth state lost       | NER    | HIGH     | Add listener for session restoration                 |
| `lazyWithRetry` can cause infinite reload loop  | NER    | MEDIUM   | Remove — Next.js handles chunk loading               |
| `threading.Lock` in async FastAPI context        | NER    | LOW      | Convert to `asyncio.Lock` for async-safe locking     |
| 3,300-line monolithic `main.py`                 | NER    | MEDIUM   | Consider splitting into FastAPI routers (later phase) |
| Hardcoded mock data loaded into Context state   | sih    | LOW      | Eventually replace with backend API calls            |
| Firebase SDK full import (large bundle)          | NER    | MEDIUM   | Use modular tree-shakeable imports                   |

---

## 10. Risks

| Risk                                                    | Likelihood | Impact | Mitigation                                              |
|--------------------------------------------------------|------------|--------|----------------------------------------------------------|
| Next.js + FastAPI dual-server complexity                | HIGH       | MEDIUM | Use `next.config.ts` rewrites to proxy `/api/*` to FastAPI |
| Firebase auth migration breaks existing sih demo flow   | MEDIUM     | HIGH   | Keep demo login as fallback when Firebase not configured |
| TypeScript conversion of NER JSX components             | HIGH       | LOW    | Convert incrementally, use `allowJs: true` in tsconfig  |
| Env var mismatch between Vite (`import.meta.env`) and Next.js (`process.env`) | HIGH | MEDIUM | Systematic find-and-replace during migration |
| Supabase credentials not available for dev              | MEDIUM     | LOW    | NER backend already has in-memory fallback              |
| Google Routes API key not available                     | MEDIUM     | LOW    | NER backend already has surveyed highway fallback       |
| Bundle size increase from adding Firebase               | MEDIUM     | MEDIUM | Tree-shake Firebase imports, dynamic import auth        |

---

## 11. Proposed Final Directory Tree

```
sih/                              # Merged project root
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (sih)
│   │   ├── page.tsx              # Landing / public home
│   │   ├── globals.css           # Global styles (sih)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page (merged sih modal + NER Firebase)
│   │   ├── (dashboard)/          # Route group for authenticated views
│   │   │   ├── layout.tsx        # Dashboard layout (Header + Sidebar + MobileNav)
│   │   │   ├── overview/page.tsx
│   │   │   ├── map/page.tsx
│   │   │   ├── routes/page.tsx
│   │   │   ├── vehicles/page.tsx
│   │   │   ├── shipments/page.tsx
│   │   │   ├── accessibility/page.tsx
│   │   │   ├── alerts/page.tsx
│   │   │   ├── weather/page.tsx
│   │   │   ├── field-reports/page.tsx
│   │   │   ├── emergency/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── incidents/page.tsx      # NER import
│   │   │   ├── risk-analysis/page.tsx  # NER import
│   │   │   ├── ai-assistant/page.tsx   # NER import
│   │   │   └── settings/page.tsx       # NER import
│   │   └── api/                  # Next.js API routes (optional proxy)
│   │       └── [...proxy]/route.ts
│   ├── components/
│   │   ├── layout/               # Header, Sidebar, MobileNav, LandingModal (sih)
│   │   ├── views/                # View components (sih — 12 views)
│   │   ├── modals/               # Modals (sih)
│   │   ├── map/                  # LeafletMap (sih)
│   │   ├── ui/                   # Shared UI primitives (sih)
│   │   ├── auth/                 # ProtectedRoute (from NER, TS)
│   │   └── common/               # ErrorBoundary, TacticalLoader (from NER)
│   ├── context/
│   │   ├── AppContext.tsx        # Operational state (sih, slimmed)
│   │   ├── AuthContext.tsx       # Firebase auth (from NER, TS)
│   │   ├── ThemeContext.tsx      # Theme toggle (from NER, TS)
│   │   └── LanguageContext.tsx   # i18n (sih translations + NER structure)
│   ├── constants/
│   │   └── roles.ts              # RBAC config (from NER, TS)
│   ├── data/                     # Mock datasets (sih)
│   ├── lib/
│   │   ├── firebase.ts           # Firebase init (from NER, TS, env-only)
│   │   ├── googleMapsApi.ts      # SerpApi places (sih)
│   │   └── utils.ts              # Shared utilities
│   └── types/                    # TypeScript type definitions (sih)
├── backend/                      # FastAPI backend (from NER)
│   ├── main.py
│   ├── database.py
│   ├── chatbot.py
│   ├── security.py
│   ├── schemas.py
│   ├── polyglot_service.py
│   ├── transport_ministry_service.py
│   ├── requirements.txt
│   └── .env.example
├── package.json                  # Next.js deps (sih + firebase)
├── next.config.ts                # Next.js config + API proxy rewrites
├── tsconfig.json
├── postcss.config.mjs
├── .env.example                  # Unified env template
├── .env.local                    # Local dev secrets (gitignored)
├── .gitignore
└── README.md
```

---

## 12. Phase Execution Plan

| Phase | Focus              | Key Actions                                                                          |
|-------|--------------------|--------------------------------------------------------------------------------------|
| **1** | Frontend           | Convert SPA to App Router, code splitting, migrate best NER UI, responsive fixes     |
| **2** | API Layer          | Import NER backend, wire frontend to APIs, proxy config, validate all endpoints      |
| **3** | Authentication     | Import Firebase auth, fix startup latency, add `onAuthStateChanged`, RBAC guards     |
| **4** | Performance        | Measure & optimize: bundle size, auth startup, API latency, re-renders, waterfalls   |
| **5** | Cleanup & Finalize | Remove dead code, update README, final build validation, git checkpoint              |

---

## AUDIT COMPLETE

### Summary of Findings

- **Architecture Gap**: sih is a fully client-side Next.js SPA with no backend, no auth, and mock data. NER has a substantial FastAPI backend (40+ endpoints), Firebase auth, and Supabase DB — but uses Vite/JSX instead of Next.js/TypeScript.

- **Key Conflicts**: Both repos have overlapping UI for vehicles, shipments, alerts, analytics, maps, and AI assistant. sih implementations are richer in UI polish; NER implementations have real backend wiring. Strategy: keep sih UI, wire to NER backend.

- **Auth Delta**: sih has zero real auth. NER has Firebase auth but with critical UX problems (in-memory persistence kills sessions on reload, no `onAuthStateChanged` listener). Auth migration requires fixing these issues, not just copying NER's implementation.

- **API Surface**: NER has a large API surface (routes, GPS, vehicles, SOS, VAHAN, chatbot, blockages, mesh) that sih completely lacks. The entire backend imports wholesale. Two hardcoded API key fallbacks must be removed.

- **Security Concerns**: NER has hardcoded Firebase config values in `.env.example` files (with real project credentials), hardcoded Google API key in `main.py:1096`, and a `saveFirebaseConfig` function that stores Firebase config in localStorage. All must be cleaned up.

- **Performance Concerns**: sih's monolithic Context + no code splitting is the top frontend issue. NER's auth startup waterfall (in-memory persistence + no `onAuthStateChanged`) is the top auth issue. Both are fixable.

- **Features to Migrate from NER**: Firebase auth + RBAC, FastAPI backend (all endpoints), Supabase DB layer, Google Routes API integration, WebSocket real-time data, AI chatbot engine, security middleware, ThemeContext, ErrorBoundary, code splitting patterns.

- **Features to Preserve from sih**: All 12 view components, Leaflet maps, Recharts analytics, offline field reports, emergency ops workflow, notification system, driver HUD, multi-language translations, TypeScript types, SerpApi places integration.

- **Next Phase**: Phase 1 — Frontend (convert SPA to App Router routes, add code splitting, migrate best NER UI components, responsive/mobile/desktop improvements).

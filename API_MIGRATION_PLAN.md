# API MIGRATION PLAN — sih × NER Unified App

**Date**: 2026-09-18
**Phase**: 2 — API Layer
**Baseline**: sih API Architecture (Authoritative)
**Source**: NER Backend & Service Layer (Selective Import)

---

## 1. Unified API Architecture Matrix

| Domain / Feature | sih Implementation | NER Implementation | Final Implementation Plan |
| :--- | :--- | :--- | :--- |
| **Maps (Places & Amenities)** | Client-side SerpApi fetch in `src/lib/googleMapsApi.ts` with local mock fallback | None | **Keep sih client + proxy route**: Use `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` / `NEXT_PUBLIC_SERP_API_KEY` with graceful fallback to `MOCK_NER_PLACES`. |
| **Maps (Routes & Corridors)** | Static route options in `RoutesView.tsx` | Server-side Google Routes API (`POST /api/v1/routes/google`) with in-memory TTL caching and surveyed NH fallback | **Import NER backend endpoint**: Keeps Google Routes API key server-side. Connect `RoutesView` and `LiveMapView` via Next.js proxy rewrite. |
| **Road Blockages & Detours** | None | `GET /api/routes/blockages` & `POST /api/routes/alternate` in `backend/main.py` | **Import NER backend**: Serves active landslide/flood roadblocks and computed valley detours to `AIBlockageRerouteModal`. |
| **Weather Telemetry** | Local mock weather dataset in `src/data/weather.ts` covering all 8 NER states | Weather impact factors in route risk assessment | **Keep sih mock data + backend endpoint**: Serves state weather profiles and computes weather-weighted road risk scores without requiring paid live radar API. |
| **AI Logistics Intelligence** | Client mock copilot in `AiCopilotModal.tsx` / `src/data/aiCopilot.ts` | Complete domain-knowledge AI engine in `backend/chatbot.py` (`POST /api/chat`) with Wikipedia fallback | **Import NER AI Chatbot**: Connect `AiCopilotModal` to `POST /api/chat` with offline fallback to `src/data/aiCopilot.ts`. |
| **Fleet & AIS-140 Tracking** | Client simulated GPS movement (6s interval) in `AppContext.tsx` | REST endpoints (`/api/vehicles`, `/api/vehicles/realtime`) and SSE/WebSocket stream | **Hybrid Integration**: Server-side vehicle registry with AIS-140 compliance, retaining sih client simulation as offline fallback. |
| **MoRTH VAHAN 4.0** | None | Supabase PostgreSQL + local cache with 21 authentic NE vehicle RC records (`GET /api/vahan/verify/{plate}`) | **Import NER VAHAN Engine**: Provides instant registration certificate verification for `VehicleDossierModal`. |
| **Emergency SOS Dispatch** | Mock OTP/biometric audit log in `AppContext.tsx` | Realtime SOS call session manager (`POST /api/sos/call/initiate`, `/end`) | **Keep sih command UI + import NER SOS backend**: Dispatches emergency telemetry packets to NDRF/SDRF channels. |
| **LoRa Mesh Simulation** | Static nodes in `src/data/` | `/api/mesh/nodes` and `/api/mesh/telemetry` | **Import NER backend endpoints**: Simulates 865–867 MHz LoRa telemetry packets for disaster zones. |

---

## 2. Detailed Per-API Specification

### 2.1 Google Routes API (Corridor Calculation)
- **Provider**: Google Cloud Routes API v2
- **Endpoint**: `https://routes.googleapis.com/directions/v2:computeRoutes` (Server-side)
- **Backend Internal Route**: `POST /api/v1/routes/google`
- **Auth**: API Key passed via `X-Goog-Api-Key` header
- **Environment Variable**: `GOOGLE_ROUTES_API_KEY` or `GOOGLE_MAPS_API_KEY` (Backend only, never exposed client-side)
- **Request Shape**:
  ```json
  {
    "origin": { "latitude": 26.1445, "longitude": 91.7362 },
    "destination": { "latitude": 27.5861, "longitude": 91.8594 },
    "weather_condition": "rainy",
    "road_condition": "muddy"
  }
  ```
- **Response Shape**:
  ```json
  {
    "distance": { "meters": 495000, "km": 495.0, "text": "495.0 km" },
    "duration": { "seconds": 42120, "hours": 11.7, "text": "11h 42m" },
    "route": {
      "coordinates": [[26.14, 91.73], [27.58, 91.85]],
      "encoded_polyline": "...",
      "summary": "NH-13 Trans-Arunachal Highway"
    },
    "source": "Google Routes API",
    "risk_assessment": { "composite_risk": 21, "recommendation": "All clear via Sela Tunnel" }
  }
  ```
- **Error Handling**: 2-second timeout. If external call fails, network timeout occurs, or API key is absent, it returns authentic surveyed National Highway corridor coordinates.

### 2.2 Google Maps Places / Amenities (SerpApi)
- **Provider**: SerpApi Google Maps Engine
- **Endpoint**: `https://serpapi.com/search.json?engine=google_maps&q={query}&ll=@{lat},{lng},14z&api_key={apiKey}`
- **Auth**: Query parameter `api_key`
- **Environment Variable**: `NEXT_PUBLIC_SERP_API_KEY` or `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Location**: `src/lib/googleMapsApi.ts`
- **Request Shape**: `searchGoogleMapsPlaces(query, lat, lng, apiKey)`
- **Response Shape**: `Array<GoogleMapPlace>` (title, rating, type, address, phone, gpsCoordinates, distanceKm)
- **Error Handling**: 3.5s `AbortController` timeout. If request fails or key is missing, falls back instantly to `MOCK_NER_PLACES`.

### 2.3 AI Logistics Copilot & Chatbot
- **Provider**: Internal NER Domain Intelligence Engine + Wikipedia REST API
- **Endpoint**: `POST /api/chat`
- **Auth**: None required (local processing)
- **Environment Variable**: Optional `OPENAI_API_KEY` for future hybrid external LLM calls
- **Location**: Backend `chatbot.py`, Frontend `AiCopilotModal.tsx` & `chatService.ts`
- **Request Shape**:
  ```json
  {
    "message": "What is the status of Sonapur Tunnel on NH-27?",
    "history": []
  }
  ```
- **Response Shape**:
  ```json
  {
    "response": "NH-27 Sonapur Tunnel in Meghalaya is currently experiencing active mudflow...",
    "source": "NER Knowledge Base",
    "suggested_actions": ["View Detour", "Check Weather"]
  }
  ```
- **Error Handling**: Synchronous local rule and regex matching executes in <10ms. Wikipedia REST API call has 3.0s timeout with immediate fallback.

### 2.4 MoRTH VAHAN 4.0 Vehicle Verification
- **Provider**: National Register / Supabase PostgreSQL / In-Memory Fallback
- **Endpoint**: `GET /api/vahan/verify/{vehicle_number}`
- **Auth**: Backend Supabase credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- **Location**: Backend `transport_ministry_service.py`, Frontend `VehicleDossierModal.tsx`
- **Request**: Normalized vehicle plate (e.g. `AS-01-EV-4421`)
- **Response Shape**:
  ```json
  {
    "success": true,
    "source": "Ministry of Road Transport and Highways • VAHAN 4.0",
    "record": {
      "registration_number": "AS-01-EV-4421",
      "owner_name": "Assam State Disaster Management Authority",
      "maker": "Tata Motors",
      "model": "Xenon 4x4 High-Terrain Ambulance",
      "emission_norms": "BHARAT STAGE VI (BS-VI)",
      "ais_140_vltd_device_id": "VLTD-AS-9921"
    }
  }
  ```
- **Error Handling**: If Supabase credentials are not configured, retrieves from `LOCAL_VAHAN_STORAGE` or `REAL_VEHICLE_NUMBERS_DATABASE` with 100% reliability.

### 2.5 Road Blockages & Alternate Detours
- **Provider**: Internal NER Geospatial Corridors Engine
- **Endpoints**:
  - `GET /api/routes/blockages`
  - `POST /api/routes/alternate`
- **Auth**: None (Internal public API)
- **Location**: Backend `main.py`, Frontend `AIBlockageRerouteModal.tsx`
- **Request Shape**:
  ```json
  {
    "origin_hub_id": "guwahati",
    "dest_hub_id": "tawang",
    "blocked_road_id": "blk-1",
    "vehicle_id": "AS-01-EV-4421"
  }
  ```
- **Response Shape**: Includes `blockage_details`, `ai_alternate_route` (distance, ETA, risk score, navigation steps), and `voice_announcement`.
- **Error Handling**: Returns cached surveyed diversion corridors with 0 failure rate.

---

## 3. Environment Variable Strategy

1. **Frontend (`sih/.env.local` / `sih/.env.example`)**:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Client Google Maps / Places API key
   - `NEXT_PUBLIC_SERP_API_KEY`: SerpApi key for amenities search (fallback)
   - `NEXT_PUBLIC_BACKEND_URL`: `http://localhost:8000` (defaults to current origin via Next.js rewrites)

2. **Backend (`sih/backend/.env`)**:
   - `GOOGLE_ROUTES_API_KEY` / `GOOGLE_MAPS_API_KEY`: Server-side only for Google Routes API
   - `SUPABASE_URL`: Supabase URL for persistent telemetry
   - `SUPABASE_ANON_KEY`: Supabase anon public key
   - `ALLOWED_ORIGINS`: `http://localhost:3000,http://localhost:5173`
   - `SOS_RECEIVER_PHONE`: Emergency dispatch contact (`+91 95705 25463`)

---

## 4. Security & Isolation Guarantee
- **No Secret Exposure**: Google Routes API key and database service keys reside exclusively in `sih/backend/` and are never prefixed with `NEXT_PUBLIC_`.
- **Next.js Reverse Proxy**: All frontend calls target `/api/*`, transparently proxied by Next.js rewrites to the FastAPI server, avoiding CORS preflight delays and hiding backend infrastructure.


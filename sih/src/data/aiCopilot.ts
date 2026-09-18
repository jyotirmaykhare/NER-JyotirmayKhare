export interface CopilotQuery {
  id: string;
  question: string;
  shortLabel: string;
  answer: string;
  actionType: "focus_map" | "navigate_tab" | "select_road" | "select_shipment";
  actionPayload?: {
    lat?: number;
    lng?: number;
    zoom?: number;
    tab?: string;
    roadId?: string;
    shipmentId?: string;
    label?: string;
  };
}

export const COPILOT_PRESET_QUERIES: CopilotQuery[] = [
  {
    id: "query-1",
    question: "Which districts are currently at highest risk?",
    shortLabel: "Highest Risk Districts",
    answer: "Based on real-time sensor telemetry and precipitation radar, the top vulnerable districts right now are:\n\n1. **West Siang (Arunachal Pradesh)** — **84%** risk (Active mudslide on NH-13, 142mm rain)\n2. **West Kameng / Tawang (Arunachal)** — **78%** risk (Sela pass scree-fall & heavy mist)\n3. **Cachar / Barak Valley (Assam)** — **71%** risk (Barak river pier 3 erosion)\n4. **Ukhrul (Manipur)** — **68%** risk (Roadbed subsidence & boulder falls)\n\nRecommendation: Restrict non-essential multi-axle freight to West Siang and divert traffic via southern bypass corridors.",
    actionType: "focus_map",
    actionPayload: {
      lat: 28.1800,
      lng: 94.9500,
      zoom: 8,
      label: "West Siang Sector",
    },
  },
  {
    id: "query-2",
    question: "Which route should I use for medical supplies from Guwahati to Tawang?",
    shortLabel: "Medical Route to Tawang",
    answer: "For temperature-sensitive and critical medical cargo (Guwahati → Tawang):\n\n**Recommended Corridor: Green Corridor Alpha (Via Balipara - Bhalukpong - Dirang - Sela Tunnel)**\n• Distance: 495 km\n• ETA: 11h 42m (Escorted)\n• Disruption Risk: 21% (Low)\n• Accessibility: 94%\n\nWhy this route? Although 18 km longer than older bypasses, it utilizes the protected Sela Tunnel corridor and avoids the high-risk scree zone near old Sela pass.",
    actionType: "navigate_tab",
    actionPayload: {
      tab: "routes",
      label: "Route Intelligence Planner",
    },
  },
  {
    id: "query-3",
    question: "Why was Alternate Route B recommended for NH-15?",
    shortLabel: "Why Alternate Route B?",
    answer: "NH-15 between Tezpur and North Lakhimpur is currently experiencing flash culvert waterlogging at KM 84 (+2h 45m delay).\n\n**Alternate Route B (Jamugurihat - Biswanath Elevated Bypass)** was selected because:\n1. 34% lower flood vulnerability index.\n2. Raised all-weather bitumen surface with unobstructed drainage.\n3. Enables freight to maintain steady 45 km/h transit with zero stalling hazard.",
    actionType: "select_road",
    actionPayload: {
      roadId: "road-2",
      tab: "map",
      lat: 26.8300,
      lng: 93.6500,
      zoom: 9,
      label: "Inspect NH-15 Bypass",
    },
  },
  {
    id: "query-4",
    question: "Which shipments are currently delayed?",
    shortLabel: "Delayed Shipments",
    answer: "There are currently 2 active delayed consignments flagged in the system:\n\n1. **NER-REL-80124 (Assam Relief Dry Rations)**\n   • Delayed: +1h 45m at Biswanath Chariali due to NH-15 waterlogging\n   • New ETA: 17:45 PM\n\n2. **NER-FOD-55092 (FCI Buffer Stock Wheat)**\n   • Delayed: +2h 15m at Litan sector (Manipur) due to stalled heavy truck clearance\n   • New ETA: 18:30 PM\n\n*Note: Vaccine consignment NER-MED-20491 is on schedule with stable cold-chain at 3.8°C.*",
    actionType: "navigate_tab",
    actionPayload: {
      tab: "shipments",
      label: "Shipment Tracking",
    },
  },
  {
    id: "query-5",
    question: "Show high-risk roads and blockages.",
    shortLabel: "Show High-Risk Roads",
    answer: "Currently 3 road segments have high-risk or blocked status:\n\n🔴 **NH-13 (West Siang Sector)** — **BLOCKED** by 80m mudslide.\n🟠 **Bhalukpong - Tawang Corridor** — **HIGH RISK (78%)** scree falls near Sela.\n🟠 **NH-10 (Sevoke - Gangtok)** — **HIGH RISK (74%)** Teesta riverbank subsidence.\n\nClick below to zoom straight to the critical blockages on the GIS layer.",
    actionType: "focus_map",
    actionPayload: {
      lat: 27.5000,
      lng: 92.5000,
      zoom: 7,
      tab: "map",
      label: "High-Risk Mountain Corridors",
    },
  },
];

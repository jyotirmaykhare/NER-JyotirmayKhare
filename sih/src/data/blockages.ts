import { BlockageInfo, RouteAlternative } from "@/types/api";

/**
 * Curated offline dataset for road blockages and computed detours.
 *
 * Single source of truth shared by the `/api/routes/blockages` +
 * `/api/routes/alternate` route handlers (fallback when the FastAPI geospatial
 * engine is unreachable) and the AI Blockage Reroute modal (initial render).
 */

export const BLOCKAGE_FALLBACK: BlockageInfo[] = [
  {
    blockage_id: "blk-1",
    road_name: "NH-13 Sela Pass Sector (Km 42-48)",
    highway: "Trans-Arunachal Highway",
    location_name: "West Kameng Pass Corridor",
    lat: 27.505,
    lng: 92.102,
    reason:
      "Heavy mud debris and granite boulder slippage across both lanes following continuous mountain rain.",
    status: "CLOSED (Emergency Convoy Only)",
    clearing_eta: "6 to 8 hours (BRO Project Vartak active)",
    diversion_corridor: "Sela All-Weather Twin Tunnel (Bypass Km 38)",
    reported_at: "25 mins ago",
  },
  {
    blockage_id: "blk-2",
    road_name: "NH-27 Sonapur Tunnel Approach",
    highway: "East-West Highway Corridor",
    location_name: "Jaintia Hills Sector, Meghalaya",
    lat: 25.105,
    lng: 92.365,
    reason:
      "Sub-surface mudflow and water discharge over highway surface. Heavy commercial freight restricted.",
    status: "RESTRICTED 1-LANE",
    clearing_eta: "3 to 4 hours",
    diversion_corridor: "Old Jowai-Badarpur Mountain Bypass",
    reported_at: "1 hour ago",
  },
  {
    blockage_id: "blk-3",
    road_name: "NH-29 Chumukedima Hill Section",
    highway: "Dimapur-Kohima Highway",
    location_name: "Old Medziphema Gorge, Nagaland",
    lat: 25.775,
    lng: 93.79,
    reason:
      "Rockfall and cliff overhang instability during rainfall. Single-lane convoy under escort.",
    status: "ESCORT PASSAGE ONLY",
    clearing_eta: "5 hours",
    diversion_corridor: "Niuland-Kohima Alternative Ridge Road",
    reported_at: "2 hours ago",
  },
];

export function getFallbackBlockage(blockageId?: string | null): BlockageInfo {
  return BLOCKAGE_FALLBACK.find((b) => b.blockage_id === blockageId) || BLOCKAGE_FALLBACK[0];
}

export const ALTERNATE_ROUTE_FALLBACK: Record<string, RouteAlternative> = {
  "blk-1": {
    route_type: "safest",
    title: "Sela Twin-Tube Tunnel All-Weather Bypass",
    corridor_name: "NH-13 Green Corridor Alpha",
    distance_km: 495,
    eta_hours: 11.7,
    duration_text: "11h 42m",
    fuel_required_litres: 48.2,
    fuel_sufficient: true,
    fuel_margin_litres: 16.8,
    remaining_fuel_after_trip_litres: 16.8,
    risk_score: 21,
    risk_level: "Low",
    landslide_probability_pct: 12,
    monsoon_waterlogging: false,
    elevation_gain_m: 2180,
    hazards_encountered: [
      "Scree fall mitigated by tunnel enclosure",
      "Zero exposure to the active Sela Pass slide zone",
    ],
    navigation_steps: [
      {
        step_number: 1,
        instruction: "Diverge right from NH-13 at Km 38 Dirang bypass gate",
        distance_km: 12.4,
        duration_text: "22 mins",
        maneuver: "turn-right",
      },
      {
        step_number: 2,
        instruction: "Enter South Portal of Sela All-Weather Tunnel (Elev. 3000m)",
        distance_km: 9.8,
        duration_text: "18 mins",
        maneuver: "straight",
      },
      {
        step_number: 3,
        instruction: "Re-join primary Tawang corridor past hazardous scree zone",
        distance_km: 18.2,
        duration_text: "35 mins",
        maneuver: "merge",
      },
    ],
    coordinates: [
      [26.1445, 91.7362],
      [26.6338, 92.7926],
      [27.01, 92.65],
      [27.35, 92.24],
      [27.5, 92.09],
      [27.5861, 91.8594],
    ],
  },
  "blk-2": {
    route_type: "safest",
    title: "Old Jowai-Badarpur Mountain Bypass",
    corridor_name: "NH-06 Barak Valley Arterial",
    distance_km: 320,
    eta_hours: 8.25,
    duration_text: "8h 15m",
    fuel_required_litres: 38.5,
    fuel_sufficient: true,
    fuel_margin_litres: 24.5,
    remaining_fuel_after_trip_litres: 24.5,
    risk_score: 28,
    risk_level: "Low",
    landslide_probability_pct: 18,
    monsoon_waterlogging: true,
    elevation_gain_m: 890,
    hazards_encountered: [
      "Elevated Bailey bridge 25T load limit",
      "Seasonal waterlogging at the valley base",
    ],
    navigation_steps: [
      {
        step_number: 1,
        instruction: "Take Jowai bypass road before Sonapur choke point",
        distance_km: 16.0,
        duration_text: "28 mins",
        maneuver: "turn-left",
      },
      {
        step_number: 2,
        instruction: "Cross elevated Bailey bridge sector with 25T load limit",
        distance_km: 4.2,
        duration_text: "9 mins",
        maneuver: "straight",
      },
      {
        step_number: 3,
        instruction: "Merge onto NH-06 arterial road towards Silchar valley",
        distance_km: 22.1,
        duration_text: "38 mins",
        maneuver: "merge",
      },
    ],
    coordinates: [
      [25.105, 92.365],
      [25.22, 92.51],
      [25.05, 92.72],
      [24.82, 92.79],
    ],
  },
  "blk-3": {
    route_type: "safest",
    title: "Niuland-Kohima Alternative Ridge Road",
    corridor_name: "Dimapur-Kohima Ridge Escort",
    distance_km: 74,
    eta_hours: 2.75,
    duration_text: "2h 45m",
    fuel_required_litres: 14.0,
    fuel_sufficient: true,
    fuel_margin_litres: 38.0,
    remaining_fuel_after_trip_litres: 38.0,
    risk_score: 32,
    risk_level: "Medium",
    landslide_probability_pct: 22,
    monsoon_waterlogging: false,
    elevation_gain_m: 1240,
    hazards_encountered: [
      "Narrow ridge carriageway",
      "Escort mandatory after 18:00 hrs",
    ],
    navigation_steps: [
      {
        step_number: 1,
        instruction: "Exit Dimapur ring road via Niuland connector",
        distance_km: 8.5,
        duration_text: "15 mins",
        maneuver: "turn-right",
      },
      {
        step_number: 2,
        instruction: "Follow ridge road bypassing rockfall overhang zone",
        distance_km: 34.0,
        duration_text: "1h 10m",
        maneuver: "straight",
      },
      {
        step_number: 3,
        instruction: "Re-enter NH-29 at Kohima checkpost gate",
        distance_km: 12.0,
        duration_text: "25 mins",
        maneuver: "merge",
      },
    ],
    coordinates: [
      [25.775, 93.79],
      [25.82, 93.85],
      [25.75, 94.02],
      [25.6751, 94.1086],
    ],
  },
};

export function getFallbackAlternate(blockageId?: string | null): RouteAlternative {
  if (blockageId && ALTERNATE_ROUTE_FALLBACK[blockageId]) {
    return ALTERNATE_ROUTE_FALLBACK[blockageId];
  }
  return ALTERNATE_ROUTE_FALLBACK["blk-1"];
}

export function buildVoiceAnnouncement(
  blockageId: string | null | undefined,
  alternate: RouteAlternative
): string {
  return `Emergency detour notice: Road ${blockageId || "segment"} is obstructed. AI detour via ${
    alternate.title
  } is active. Distance: ${alternate.distance_km} kilometers. Estimated transit time: ${
    alternate.duration_text || `${alternate.eta_hours} hours`
  }.`;
}

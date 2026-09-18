import { NextRequest, NextResponse } from "next/server";

const ALTERNATES_DB: Record<string, any> = {
  "blk-1": {
    blockage_id: "blk-1",
    diversion_name: "Sela Twin-Tube Tunnel All-Weather Bypass",
    distance_km: 495.0,
    duration_text: "11h 42m",
    risk_score: 21,
    fuel_required_litres: 48.2,
    fuel_margin_litres: 16.8,
    navigation_steps: [
      { step_number: 1, instruction: "Diverge right from NH-13 at Km 38 Dirang bypass gate", distance_km: 12.4 },
      { step_number: 2, instruction: "Enter South Portal of Sela All-Weather Tunnel (Elev. 3000m)", distance_km: 9.8 },
      { step_number: 3, instruction: "Re-join primary Tawang corridor past hazardous scree zone", distance_km: 18.2 },
    ],
  },
  "blk-2": {
    blockage_id: "blk-2",
    diversion_name: "Old Jowai-Badarpur Mountain Bypass",
    distance_km: 320.0,
    duration_text: "8h 15m",
    risk_score: 28,
    fuel_required_litres: 38.5,
    fuel_margin_litres: 24.5,
    navigation_steps: [
      { step_number: 1, instruction: "Take Jowai bypass road before Sonapur choke point", distance_km: 16.0 },
      { step_number: 2, instruction: "Cross elevated Bailey bridge sector with 25T load limit", distance_km: 4.2 },
      { step_number: 3, instruction: "Merge onto NH-06 arterial road towards Silchar valley", distance_km: 22.1 },
    ],
  },
  "blk-3": {
    blockage_id: "blk-3",
    diversion_name: "Niuland-Kohima Alternative Ridge Road",
    distance_km: 74.0,
    duration_text: "2h 45m",
    risk_score: 32,
    fuel_required_litres: 14.0,
    fuel_margin_litres: 38.0,
    navigation_steps: [
      { step_number: 1, instruction: "Exit Dimapur ring road via Niuland connector", distance_km: 8.5 },
      { step_number: 2, instruction: "Follow ridge road bypassing rockfall overhang zone", distance_km: 34.0 },
      { step_number: 3, instruction: "Re-enter NH-29 at Kohima checkpost gate", distance_km: 12.0 },
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blockageId = body.blocked_road_id || body.blockage_id || "blk-1";
    const alternate = ALTERNATES_DB[blockageId] || ALTERNATES_DB["blk-1"];

    return NextResponse.json({
      success: true,
      blockage_id: blockageId,
      ai_alternate_route: alternate,
      voice_announcement: `Emergency detour notice: Road ${blockageId} is obstructed. AI detour via ${alternate.diversion_name} is active. Distance: ${alternate.distance_km} kilometers. Estimated transit time: ${alternate.duration_text}.`,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compute alternate route" },
      { status: 500 }
    );
  }
}


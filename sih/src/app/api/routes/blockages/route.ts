import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      blockage_id: "blk-1",
      road_name: "NH-13 Sela Pass Sector (Km 42-48)",
      highway: "Trans-Arunachal Highway",
      stretch: "Km 42 - Km 48",
      state: "Arunachal Pradesh",
      lat: 27.5050,
      lng: 92.1020,
      coordinates: [
        [27.4980, 92.1150], [27.5020, 92.1080], [27.5050, 92.1020], [27.5080, 92.0960], [27.5120, 92.0880]
      ],
      location_name: "West Kameng Pass Corridor",
      reason: "Heavy mud debris and granite boulder slippage across both lanes following continuous mountain rain.",
      status: "CLOSED (Emergency Convoy Only)",
      clearing_eta: "6 to 8 hours (BRO Project Vartak active)",
      diversion_corridor: "Sela All-Weather Twin Tunnel (Bypass Km 38)",
      reported_by: "NER-LIFELINE Field Ground Unit (BRO Post)",
    },
    {
      blockage_id: "blk-2",
      road_name: "NH-27 Sonapur Tunnel Approach",
      highway: "East-West Highway Corridor",
      stretch: "Km 182 - Km 186",
      state: "Meghalaya",
      lat: 25.1050,
      lng: 92.3650,
      coordinates: [
        [25.1150, 92.3550], [25.1050, 92.3650], [25.0950, 92.3750]
      ],
      location_name: "Jaintia Hills Sector, Meghalaya",
      reason: "Sub-surface mudflow and water discharge over highway surface. Heavy commercial freight restricted.",
      status: "RESTRICTED 1-LANE",
      clearing_eta: "3 to 4 hours",
      diversion_corridor: "Old Jowai-Badarpur Mountain Bypass",
      reported_by: "Meghalaya Highway Traffic Control",
    },
    {
      blockage_id: "blk-3",
      road_name: "NH-29 Chumukedima Hill Section",
      highway: "Dimapur-Kohima Highway",
      stretch: "Km 12 - Km 15",
      state: "Nagaland",
      lat: 25.7750,
      lng: 93.7900,
      coordinates: [
        [25.7950, 93.7550], [25.7750, 93.7900], [25.7550, 93.8250]
      ],
      location_name: "Old Medziphema Gorge, Nagaland",
      reason: "Rockfall and cliff overhang instability during rainfall. Single-lane convoy under escort.",
      status: "ESCORT PASSAGE ONLY",
      clearing_eta: "5 hours",
      diversion_corridor: "Niuland-Kohima Alternative Ridge Road",
      reported_by: "Nagaland Disaster Response Telemetry",
    },
  ]);
}


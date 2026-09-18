import { NextResponse } from "next/server";
import { MOCK_VEHICLES } from "@/data/vehicles";

export async function GET() {
  return NextResponse.json({
    success: true,
    total: MOCK_VEHICLES.length,
    vehicles: MOCK_VEHICLES,
    telemetry_standard: "MoRTH AIS-140 / ERSS-112 Compliant",
    timestamp: new Date().toISOString(),
  });
}


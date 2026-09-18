import { NextRequest, NextResponse } from "next/server";
import { searchGoogleMapsPlaces } from "@/lib/googleMapsApi";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "fuel";
    const lat = parseFloat(searchParams.get("lat") || "26.2");
    const lng = parseFloat(searchParams.get("lng") || "92.9");

    const apiKey =
      process.env.SERP_API_KEY ||
      process.env.NEXT_PUBLIC_SERP_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "";

    const places = await searchGoogleMapsPlaces(query, lat, lng, apiKey);
    return NextResponse.json({
      success: true,
      query,
      count: places.length,
      places,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch highway places" },
      { status: 500 }
    );
  }
}


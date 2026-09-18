import { NextRequest, NextResponse } from "next/server";
import { searchGoogleMapsPlaces } from "@/lib/googleMapsApi";

/**
 * Highway amenity search (fuel, medical, rest stops).
 *
 * The SerpApi key is read server-side only — it is never prefixed with
 * `NEXT_PUBLIC_`, so it cannot leak into the browser bundle. Without a key (or
 * if SerpApi is unreachable) the curated NER highway dataset is served.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "fuel";
    const lat = parseFloat(searchParams.get("lat") || "26.2");
    const lng = parseFloat(searchParams.get("lng") || "92.9");

    const apiKey =
      process.env.SERP_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      "";

    const places = await searchGoogleMapsPlaces(query, lat, lng, apiKey);

    return NextResponse.json({
      success: true,
      query,
      count: places.length,
      places,
      source: apiKey ? "SerpApi Google Maps (fallback: NER curated dataset)" : "NER curated dataset",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch highway places" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { fetchBackendJson } from "@/lib/serverBackend";
import { buildFallbackVerification } from "@/data/vahan";
import type { VahanVerificationResponse } from "@/types/api";

/**
 * MoRTH VAHAN 4.0 registration verification.
 *
 * Primary source is the FastAPI `transport_ministry_service` (Supabase
 * PostgreSQL register with local cache). When the engine is unreachable the
 * curated offline register is used so AIS-140 dossiers still verify in the field.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plate: string }> }
) {
  try {
    const { plate } = await params;
    const normalized = decodeURIComponent(plate).replace(/\s+/g, "-").toUpperCase();

    if (!normalized) {
      return NextResponse.json(
        { success: false, error: "Vehicle registration number is required" },
        { status: 400 }
      );
    }

    const engineRecord = await fetchBackendJson<VahanVerificationResponse>(
      `/api/vahan/verify/${encodeURIComponent(normalized)}`
    );

    if (engineRecord?.record) {
      return NextResponse.json(engineRecord, {
        headers: { "X-NER-Source": "fastapi-engine" },
      });
    }

    return NextResponse.json(buildFallbackVerification(normalized), {
      headers: { "X-NER-Source": "offline-fallback" },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to query VAHAN national register" },
      { status: 500 }
    );
  }
}

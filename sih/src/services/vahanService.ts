import { apiGet } from "@/lib/apiClient";
import { VahanVerificationResponse } from "@/types/api";
import { buildFallbackVerification } from "@/data/vahan";

/**
 * MoRTH VAHAN 4.0 registration verification client.
 *
 * Live certificates come from the FastAPI VAHAN service; the curated offline
 * register answers when the engine is unreachable, so AIS-140 dossiers always
 * render a verifiable record.
 */

export interface VahanLookup {
  verification: VahanVerificationResponse;
  live: boolean;
  error?: string;
}

export async function verifyRegistration(plate: string): Promise<VahanLookup> {
  const normalized = String(plate || "").trim();

  if (!normalized) {
    return {
      verification: buildFallbackVerification("UNKNOWN"),
      live: false,
      error: "Vehicle registration number is required",
    };
  }

  const path = `/api/vahan/verify/${encodeURIComponent(normalized.replace(/\s+/g, "-"))}`;
  const result = await apiGet<VahanVerificationResponse>(path);

  if (result.ok && result.data?.record) {
    return { verification: result.data, live: true };
  }

  return {
    verification: buildFallbackVerification(normalized),
    live: false,
    error: result.ok ? "VAHAN payload missing record" : result.error,
  };
}
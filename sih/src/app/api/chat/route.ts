import { NextRequest, NextResponse } from "next/server";
import { postBackendJson } from "@/lib/serverBackend";
import type { ChatResponse } from "@/types/api";

/**
 * AI Logistics Copilot endpoint.
 *
 * Preferred path: the unified FastAPI AI engine (`sih/backend/chatbot.py`),
 * which owns the full domain knowledge base, reasoning and Wikipedia fallback.
 * Offline path: the curated NER knowledge base below, so the copilot keeps
 * answering during network blackouts.
 */

const OFFLINE_HEADERS = { "X-NER-Source": "offline-fallback" };

// Comprehensive NER Logistics Knowledge Base (offline fallback)
const NER_KNOWLEDGE = [
  {
    keywords: ["sela", "tunnel", "nh-13", "pass", "arunachal"],
    answer: "Sela Tunnel (located on NH-13 in West Kameng, Arunachal Pradesh at an elevation of 13,000 ft / 3,000m) is the world's longest bi-lane all-weather mountain tunnel. Engineered by BRO Project Vartak, it bypasses the treacherous Sela Pass and guarantees year-round logistical access to Tawang and forward defense posts.",
    source: "Border Roads Organisation (BRO) Project Vartak",
    suggestions: ["What is the status of NH-13?", "Show Sela Tunnel bypass detour", "What is the elevation of Sela Pass?"]
  },
  {
    keywords: ["sonapur", "nh-27", "meghalaya", "mudslide", "tunnel"],
    answer: "The Sonapur Tunnel on NH-27 in East Jaintia Hills, Meghalaya, is a critical choke point connecting Barak Valley (Assam), Mizoram, and Tripura. It frequently faces monsoon mudflow over the tunnel entrance. Heavy commercial convoys are regulated during torrential downpours.",
    source: "Meghalaya Disaster Management Authority & BRO",
    suggestions: ["View Jowai-Badarpur bypass", "Check NH-27 weather status", "Find heavy vehicle refueling near Sonapur"]
  },
  {
    keywords: ["bogibeel", "bridge", "brahmaputra", "dibrugarh"],
    answer: "Bogibeel Bridge is a 4.94 km combined road and rail bridge over the Brahmaputra River in Dibrugarh, Assam. Built to withstand earthquakes up to magnitude 7.0 (Seismic Zone V), it is India's longest rail-cum-road bridge and cuts transit time between Assam and Arunachal Pradesh by over 10 hours.",
    source: "Northeast Frontier Railway (NFR)",
    suggestions: ["Tell me about Dhola-Sadiya Bridge", "Brahmaputra water level gauges", "Assam logistics routes"]
  },
  {
    keywords: ["dhola", "sadiya", "bhupen hazarika", "lohit"],
    answer: "Dhola-Sadiya Bridge (Dr. Bhupen Hazarika Setu) spans 9.15 km across the Lohit River, connecting Assam and eastern Arunachal Pradesh. It supports heavy 60-tonne battle tanks and emergency relief convoys, ensuring connectivity even during severe seasonal inundation.",
    source: "Ministry of Road Transport and Highways (MoRTH)",
    suggestions: ["Brahmaputra bridge river levels", "Highway access to Pasighat", "Emergency green corridor routes"]
  },
  {
    keywords: ["hypothermia", "medical", "first aid", "altitude", "ams"],
    answer: "At elevations above 8,000 ft (Sela, Nathu La, Bum La): For Acute Mountain Sickness (AMS), immediately descend 500-1000m, administer supplemental oxygen (2-4 L/min), and keep the patient warm. Do NOT exert. For hypothermia: gently remove wet clothes, wrap in dry wool/insulating space blankets, apply warm heat packs to torso/groin, and monitor pulse. Avoid alcohol or rapid re-warming.",
    source: "Military High-Altitude Medical Protocol (BRO / NDRF)",
    suggestions: ["Emergency CPR guidelines", "Cold chain storage specs", "Call emergency medical responder"]
  },
  {
    keywords: ["cold chain", "vaccine", "blood", "plasma", "temperature"],
    answer: "Cold-chain transport standards in high-altitude NER:\n• Blood & Plasma: Maintain strictly between -4°C and -20°C with automated PCM phase-change packaging.\n• Vaccines & Antivenom: Maintain between +2°C and +8°C with dual-calibrated temperature data loggers.\n• Maximum allowable transit delay without auxiliary cooling recharge: 14 hours in thermal canisters.",
    source: "National Health Mission (NHM) Cold Chain Guidelines",
    suggestions: ["Track vaccine convoy", "Verify temperature sensors", "View nearest hospital depots"]
  },
  {
    keywords: ["lora", "mesh", "offline", "blackout", "satellite"],
    answer: "The NER LIFELINE LoRa mesh operates on India's license-free 865–867 MHz ISM band. During cellular blackouts caused by landslides or storms, battery-backed relay nodes along highway ridges forward SOS alerts, GPS fixes, and convoy telemetry hop-by-hop up to 15 km per hop until a satellite ground uplink is reached.",
    source: "DoT / Sovereign Emergency Telecom Protocol",
    suggestions: ["Show active mesh nodes", "Send LoRa test packet", "View offline field reports"]
  },
  {
    keywords: ["states", "8 states", "capital", "region"],
    answer: "The North Eastern Region comprises 8 states (The 'Ashtalakshmi'):\n1. Assam (Dispur / Guwahati)\n2. Arunachal Pradesh (Itanagar)\n3. Meghalaya (Shillong)\n4. Manipur (Imphal)\n5. Mizoram (Aizawl)\n6. Nagaland (Kohima)\n7. Tripura (Agartala)\n8. Sikkim (Gangtok)",
    source: "North Eastern Council (NEC) / MDoNER",
    suggestions: ["View State Accessibility Index", "Inspect NH-10 Sikkim lifeline", "Check interstate border checkpoints"]
  }
];

const timestampNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = typeof body.message === "string" ? body.message : "";
    const query = message.toLowerCase().trim();

    // 1. Preferred path: unified FastAPI AI engine (domain knowledge + reasoning).
    if (message) {
      const engineAnswer = await postBackendJson<ChatResponse>("/api/chat", {
        message,
        history: body.history ?? [],
        language: body.language ?? "en",
        context: body.context,
      });

      if (engineAnswer?.answer) {
        return NextResponse.json(engineAnswer, {
          headers: { "X-NER-Source": "fastapi-engine" },
        });
      }
    }

    // 2. Offline path: curated NER knowledge base.
    if (!query) {
      return NextResponse.json(
        {
          answer: "Greetings. I am the NER Logistics Intelligence AI Copilot. You can ask me about regional highway corridors, Sela Tunnel accessibility, cold-chain standards, medical first aid, or road closures.",
          source: "NER Logistics Intelligence",
          suggestions: [
            "What are the 8 states of North East India?",
            "Status of Sela Tunnel on NH-13?",
            "Cold chain guidelines for blood plasma?",
            "Emergency protocol for hypothermia?",
          ],
          timestamp: timestampNow(),
        },
        { headers: OFFLINE_HEADERS }
      );
    }

    // Match keywords against knowledge base
    for (const entry of NER_KNOWLEDGE) {
      if (entry.keywords.some((kw) => query.includes(kw))) {
        return NextResponse.json(
          {
            answer: entry.answer,
            source: entry.source,
            suggestions: entry.suggestions,
            timestamp: timestampNow(),
          },
          { headers: OFFLINE_HEADERS }
        );
      }
    }

    // Mathematical evaluation fallback
    try {
      const mathClean = query.replace(/[^0-9+\-*/().]/g, "");
      if (mathClean && mathClean.length >= 3 && /[0-9]/.test(mathClean)) {
        const calc = new Function(`return (${mathClean})`)();
        if (typeof calc === "number" && !isNaN(calc)) {
          return NextResponse.json(
            {
              answer: `Calculation result: ${mathClean} = ${calc}`,
              source: "NER Math Engine",
              suggestions: ["Convert km to miles", "Fuel range calculation"],
              timestamp: timestampNow(),
            },
            { headers: OFFLINE_HEADERS }
          );
        }
      }
    } catch {
      // Not a math query
    }

    // General operational guidance fallback
    return NextResponse.json(
      {
        answer: `Query noted: "${message}". In the North Eastern Region, all transit decisions should account for terrain elevation and monsoon weather buffers. For critical convoy routing, consult the Routes tab or deploy an AI Blockage Detour.`,
        source: "NER Command Center Intelligence",
        suggestions: [
          "Tell me about Sela Tunnel and NH-13",
          "What is the Sonapur Tunnel status?",
          "How to treat high-altitude AMS?",
          "What is the LoRa mesh protocol?",
        ],
        timestamp: timestampNow(),
      },
      { headers: OFFLINE_HEADERS }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal chat processing error" }, { status: 500 });
  }
}
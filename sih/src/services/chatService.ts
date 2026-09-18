import { apiGet, apiPost, apiWithFallback } from "@/lib/apiClient";
import { ChatResponse, ChatSuggestionsResponse } from "@/types/api";
import { COPILOT_PRESET_QUERIES, CopilotQuery } from "@/data/aiCopilot";

/**
 * AI Copilot client.
 *
 * Live answers come from the FastAPI AI engine (domain knowledge + Wikipedia
 * fallback) through `/api/chat`. If the API layer is unavailable the curated
 * `COPILOT_PRESET_QUERIES` knowledge is used, so the copilot always responds.
 */

export interface CopilotTurn {
  role: "user" | "assistant";
  content: string;
}

export interface CopilotReply {
  answer: string;
  sourceLabel: string;
  suggestions: string[];
  timestamp: string;
  live: boolean;
  matchedPreset?: CopilotQuery;
}

function matchPreset(queryText: string): CopilotQuery | undefined {
  const lower = queryText.toLowerCase();

  return COPILOT_PRESET_QUERIES.find(
    (q) =>
      lower.includes(q.shortLabel.toLowerCase()) ||
      q.question.toLowerCase().includes(lower) ||
      (lower.includes("risk") && q.id === "query-1") ||
      (lower.includes("medic") && q.id === "query-2") ||
      (lower.includes("route b") && q.id === "query-3") ||
      (lower.includes("delay") && q.id === "query-4") ||
      (lower.includes("road") && q.id === "query-5")
  );
}

export function buildOfflineReply(
  queryText: string,
  preset?: CopilotQuery
): CopilotReply {
  const matched = preset ?? matchPreset(queryText);

  return {
    answer:
      matched
        ? matched.answer
        : `Analyzing current regional telemetry for "${queryText}"...\n\nAll 8 North Eastern states report 78% average road accessibility. Highest caution is advised along the NH-13 Trans-Arunachal corridor (West Siang sector) and the North Bank NH-15. Would you like me to highlight the active landslide zones?`,
    sourceLabel: "NER-LIFELINE Offline Knowledge Base",
    suggestions: [],
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    live: false,
    matchedPreset: matched,
  };
}

/**
 * Sends a copilot query, preferring the FastAPI AI engine and degrading to the
 * offline knowledge base.
 *
 * @param preset the preset that triggered the question (keeps its GIS action attached)
 */
export async function sendCopilotMessage(
  queryText: string,
  options: { preset?: CopilotQuery; history?: CopilotTurn[] } = {}
): Promise<CopilotReply> {
  const response = await apiWithFallback<ChatResponse>(
    () =>
      apiPost<ChatResponse>("/api/chat", {
        message: queryText,
        history: options.history ?? [],
        language: "en",
      }),
    () => {
      const offline = buildOfflineReply(queryText, options.preset);
      return {
        answer: offline.answer,
        source: offline.sourceLabel,
        suggestions: offline.suggestions,
        timestamp: offline.timestamp,
      } satisfies ChatResponse;
    },
    (payload) => Boolean(payload?.answer)
  );

  const offlinePreset = options.preset ?? matchPreset(queryText);

  return {
    answer: response.data.answer,
    sourceLabel: response.data.source || "NER Intelligence",
    suggestions: response.data.suggestions ?? [],
    timestamp: response.data.timestamp,
    live: response.source === "live",
    matchedPreset: offlinePreset,
  };
}

export async function getChatSuggestions(): Promise<ChatSuggestionsResponse> {
  const result = await apiGet<ChatSuggestionsResponse>("/api/chat/suggestions");

  if (result.ok && result.data?.categories?.length) {
    return result.data;
  }

  return {
    categories: [
      {
        title: "Offline Prompt Library",
        prompts: COPILOT_PRESET_QUERIES.map((q) => q.question),
      },
    ],
  };
}
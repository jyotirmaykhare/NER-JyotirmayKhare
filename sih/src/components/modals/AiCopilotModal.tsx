"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { COPILOT_PRESET_QUERIES, CopilotQuery } from "@/data/aiCopilot";
import { sendCopilotMessage } from "@/services/chatService";
import {
  Bot,
  Sparkles,
  Send,
  X,
  MapPin,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Zap,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  actionQuery?: CopilotQuery;
  timestamp: string;
  /** Provider that produced the answer (FastAPI engine vs offline knowledge base). */
  sourceLabel?: string;
  /** True when the answer came from the live API layer. */
  live?: boolean;
}

export function AiCopilotModal() {
  const {
    isAiCopilotOpen,
    setIsAiCopilotOpen,
    focusOnLocation,
    setSelectedRoad,
    setSelectedShipment,
    setActiveTab,
    roads,
    shipments,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-0",
      sender: "ai",
      text: "Hello! I am **NER Intelligence**, your AI Logistics & Terrain Risk Assistant. I synthesize precipitation radar, satellite slope scans, and fleet telemetry across the North Eastern Region. How can I assist your logistics planning today?",
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const msgIdRef = React.useRef(1);

  const handleSendQuery = async (queryText: string, preset?: CopilotQuery) => {
    const userMsgId = `u-${msgIdRef.current++}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: queryText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");

    // Answer resolution is delegated to the API layer service: the FastAPI AI
    // engine is preferred, the curated offline knowledge base is the fallback.
    const reply = await sendCopilotMessage(queryText, { preset });

    const aiMsg: ChatMessage = {
      id: `ai-${msgIdRef.current++}`,
      sender: "ai",
      text: reply.answer,
      actionQuery: reply.matchedPreset,
      timestamp: reply.timestamp,
      sourceLabel: reply.sourceLabel,
      live: reply.live,
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleTriggerAction = (query: CopilotQuery) => {
    if (query.actionType === "focus_map" && query.actionPayload) {
      if (query.actionPayload.lat && query.actionPayload.lng) {
        focusOnLocation(
          query.actionPayload.lat,
          query.actionPayload.lng,
          query.actionPayload.zoom || 8,
          query.actionPayload.label
        );
      }
      setActiveTab("map");
      setIsAiCopilotOpen(false);
    } else if (query.actionType === "navigate_tab" && query.actionPayload?.tab) {
      setActiveTab(query.actionPayload.tab);
      setIsAiCopilotOpen(false);
    } else if (query.actionType === "select_road" && query.actionPayload?.roadId) {
      const road = roads.find((r) => r.id === query.actionPayload?.roadId);
      if (road) {
        setSelectedRoad(road);
        if (query.actionPayload.lat && query.actionPayload.lng) {
          focusOnLocation(
            query.actionPayload.lat,
            query.actionPayload.lng,
            query.actionPayload.zoom || 9,
            road.name
          );
        }
      }
      setActiveTab("map");
      setIsAiCopilotOpen(false);
    } else if (query.actionType === "select_shipment" && query.actionPayload?.shipmentId) {
      const shipment = shipments.find((s) => s.id === query.actionPayload?.shipmentId);
      if (shipment) {
        setSelectedShipment(shipment);
      }
      setActiveTab("shipments");
      setIsAiCopilotOpen(false);
    }
  };

  if (!isAiCopilotOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-500 flex items-center justify-center text-sky-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>NER Intelligence</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800 uppercase font-bold">
                  AI Copilot
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Logistics, Terrain & Hazard Advisor
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAiCopilotOpen(false)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="p-3 bg-slate-900/40 border-b border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Recommended Questions:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COPILOT_PRESET_QUERIES.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSendQuery(q.question, q)}
                className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-sky-500/80 transition-colors text-left"
              >
                {q.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-xl ${
                  m.sender === "user"
                    ? "bg-sky-600 text-white font-medium rounded-tr-none"
                    : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none leading-relaxed"
                }`}
              >
                {/* Format markdown-like bold and bullet text simply */}
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Provider trace: live FastAPI engine vs curated offline knowledge */}
                {m.sender === "ai" && m.sourceLabel && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        m.live ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span>
                      {m.live ? "LIVE ENGINE" : "OFFLINE KB"} • {m.sourceLabel}
                    </span>
                  </div>
                )}

                {/* Actionable Button if linked to a GIS action */}
                {m.actionQuery && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleTriggerAction(m.actionQuery!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors shadow-md"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {m.actionQuery.actionType === "focus_map" ||
                        m.actionQuery.actionType === "select_road"
                          ? "SHOW ON MAP"
                          : "OPEN TOOL"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Query Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputQuery.trim()) {
              handleSendQuery(inputQuery);
            }
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about roads, risk, weather or shipments..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

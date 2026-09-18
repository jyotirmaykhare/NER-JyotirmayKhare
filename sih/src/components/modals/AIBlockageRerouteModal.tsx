"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  RefreshCw,
  MapPin,
  Clock,
  ShieldCheck,
  AlertOctagon,
  CornerUpRight,
  Radio,
} from "lucide-react";
import { BlockageInfo, RouteAlternative } from "@/types/api";
import { getAlternateRoute, getBlockages } from "@/services/routeService";
import { ALTERNATE_ROUTE_FALLBACK, BLOCKAGE_FALLBACK } from "@/data/blockages";

interface AIBlockageRerouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAlternateRoute?: (route: RouteAlternative, blockage: BlockageInfo) => void;
}

export default function AIBlockageRerouteModal({
  isOpen,
  onClose,
  onApplyAlternateRoute,
}: AIBlockageRerouteModalProps) {
  const [blockages, setBlockages] = useState<BlockageInfo[]>(BLOCKAGE_FALLBACK);
  const [selectedId, setSelectedId] = useState<string>(BLOCKAGE_FALLBACK[0].blockage_id);
  const [alternateData, setAlternateData] = useState<RouteAlternative>(
    ALTERNATE_ROUTE_FALLBACK["blk-1"]
  );
  const [voiceAnnouncement, setVoiceAnnouncement] = useState<string>("");
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load the live blockage register whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    getBlockages().then((response) => {
      if (cancelled) return;
      setBlockages(response.data);
      setIsLive(response.source === "live");
      setSelectedId((current) =>
        response.data.some((b) => b.blockage_id === current)
          ? current
          : response.data[0].blockage_id
      );
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Recompute the detour whenever the selected obstruction changes.
  useEffect(() => {
    if (!isOpen || !selectedId) return;

    let cancelled = false;
    setIsLoading(true);
    setApplied(false);

    getAlternateRoute({
      blocked_road_id: selectedId,
      origin_hub_id: "guwahati",
      destination_hub_id: "tawang",
    })
      .then((response) => {
        if (cancelled) return;
        setAlternateData(response.data.ai_alternate_route);
        setVoiceAnnouncement(response.data.voice_announcement);
        setIsLive(response.source === "live");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, selectedId]);

  if (!isOpen) return null;

  const currentBlockage =
    blockages.find((b) => b.blockage_id === selectedId) || blockages[0];

  const handleSelectBlockage = (id: string) => {
    setSelectedId(id);
    setApplied(false);
  };

  const handleApply = () => {
    if (onApplyAlternateRoute) {
      onApplyAlternateRoute(alternateData, currentBlockage);
    }
    setApplied(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Emergency Header */}
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 p-4 border-b border-rose-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 animate-pulse flex-shrink-0">
              <AlertOctagon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Road blockage and alternate detour
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-black border border-red-500/40">
                  ACTIVE BLOCKAGE
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${
                    isLive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {isLive ? "LIVE ENGINE" : "OFFLINE DATASET"}
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                Autonomous Hazard Avoidance & Dynamic Bypass Routing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm">
          {/* Active Blockage Selector Chips */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Reported Highway Closures (Select Obstruction)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {blockages.map((blk) => (
                <button
                  key={blk.blockage_id}
                  onClick={() => handleSelectBlockage(blk.blockage_id)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-start gap-2 cursor-pointer ${
                    selectedId === blk.blockage_id
                      ? "bg-rose-950/60 border-rose-500 text-white ring-1 ring-rose-500/50 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{blk.road_name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{blk.highway}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Blockage Impact Summary Card */}
          <div className="p-4 rounded-xl bg-red-950/25 border border-red-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-red-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Obstruction Incident Details
              </span>
              <span className="text-slate-400 font-mono">
                Clearing ETA: <b className="text-amber-300">{currentBlockage.clearing_eta}</b>
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentBlockage.reason}
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-red-900/30">
              <span>Location: <strong className="text-slate-300">{currentBlockage.location_name}</strong></span>
              <span className="text-rose-400 font-semibold">{currentBlockage.status}</span>
            </div>
          </div>

          {/* Voice dispatch announcement generated by the detour engine */}
          {voiceAnnouncement && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-[11px] text-cyan-100 flex items-start gap-2">
              <Radio size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  Voice Dispatch Announcement
                </div>
                <p className="leading-relaxed">{voiceAnnouncement}</p>
              </div>
            </div>
          )}

          {/* Alternate route panel */}
          {isLoading ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <RefreshCw size={24} className="animate-spin text-cyan-400" />
              <span className="text-sm font-semibold text-slate-300">
                Calculating alternate route details...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        Suggested bypass corridor
                      </span>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">
                        {currentBlockage.diversion_corridor}
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    74% SAFER
                  </span>
                </div>

                {/* Metric Delta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">BYPASS DISTANCE</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {alternateData.distance_km} km
                    </span>
                    <span className="text-[10px] text-cyan-400 block font-mono">All-Weather</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL ETA</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {alternateData.duration_text}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">Avoids Choke</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">TERRAIN HAZARD</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {alternateData.risk_score} / 100
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">Low Disruption</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">FUEL REQUIRED</span>
                    <span className="text-sm font-bold text-cyan-300 font-mono">
                      {alternateData.fuel_required_litres} L
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">DEF Buffer OK</span>
                  </div>
                </div>

                {/* Step-by-Step Detour Maneuvers */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <CornerUpRight size={13} className="text-cyan-400" /> Detour Waypoint Instructions:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {alternateData.navigation_steps.map((step) => (
                      <div
                        key={step.step_number}
                        className="flex items-start gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold font-mono text-[11px] flex-shrink-0">
                          {step.step_number}
                        </span>
                        <span className="flex-1 leading-snug">{step.instruction}</span>
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                          {step.distance_km} km
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
          >
            Dismiss
          </button>

          <button
            onClick={handleApply}
            disabled={applied}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              applied
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white shadow-sky-950/50"
            }`}
          >
            {applied ? (
              <>
                <Check size={14} />
                <span>Bypass Applied to Active Nav</span>
              </>
            ) : (
              <>
                <span>Apply bypass detour</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


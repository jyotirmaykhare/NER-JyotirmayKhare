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
} from "lucide-react";

interface Blockage {
  blockage_id: string;
  road_name: string;
  highway: string;
  location_name: string;
  reason: string;
  status: string;
  clearing_eta: string;
  diversion_corridor: string;
}

interface AlternateRouteData {
  distance_km: number;
  duration_text: string;
  risk_score: number;
  fuel_required_litres: number;
  navigation_steps: { step_number: number; instruction: string; distance_km: number }[];
}

const DEFAULT_BLOCKAGES: Blockage[] = [
  {
    blockage_id: "blk-1",
    road_name: "NH-13 Sela Pass Sector (Km 42-48)",
    highway: "Trans-Arunachal Highway",
    location_name: "West Kameng Pass Corridor",
    reason: "Heavy mud debris and granite boulder slippage across both lanes following continuous mountain rain.",
    status: "CLOSED (Emergency Convoy Only)",
    clearing_eta: "6 to 8 hours (BRO Project Vartak active)",
    diversion_corridor: "Sela All-Weather Twin Tunnel (Bypass Km 38)",
  },
  {
    blockage_id: "blk-2",
    road_name: "NH-27 Sonapur Tunnel Approach",
    highway: "East-West Highway Corridor",
    location_name: "Jaintia Hills Sector, Meghalaya",
    reason: "Sub-surface mudflow and water discharge over highway surface. Heavy commercial freight restricted.",
    status: "RESTRICTED 1-LANE",
    clearing_eta: "3 to 4 hours",
    diversion_corridor: "Old Jowai-Badarpur Mountain Bypass",
  },
  {
    blockage_id: "blk-3",
    road_name: "NH-29 Chumukedima Hill Section",
    highway: "Dimapur-Kohima Highway",
    location_name: "Old Medziphema Gorge, Nagaland",
    reason: "Rockfall and cliff overhang instability during rainfall. Single-lane convoy under escort.",
    status: "ESCORT PASSAGE ONLY",
    clearing_eta: "5 hours",
    diversion_corridor: "Niuland-Kohima Alternative Ridge Road",
  },
];

const DEFAULT_ALTERNATES: Record<string, AlternateRouteData> = {
  "blk-1": {
    distance_km: 495,
    duration_text: "11h 42m",
    risk_score: 21,
    fuel_required_litres: 48.2,
    navigation_steps: [
      { step_number: 1, instruction: "Diverge right from NH-13 at Km 38 Dirang bypass gate", distance_km: 12.4 },
      { step_number: 2, instruction: "Enter South Portal of Sela All-Weather Tunnel (Elev. 3000m)", distance_km: 9.8 },
      { step_number: 3, instruction: "Re-join primary Tawang corridor past hazardous scree zone", distance_km: 18.2 },
    ],
  },
  "blk-2": {
    distance_km: 320,
    duration_text: "8h 15m",
    risk_score: 28,
    fuel_required_litres: 38.5,
    navigation_steps: [
      { step_number: 1, instruction: "Take Jowai bypass road before Sonapur choke point", distance_km: 16.0 },
      { step_number: 2, instruction: "Cross elevated Bailey bridge sector with 25T load limit", distance_km: 4.2 },
      { step_number: 3, instruction: "Merge onto NH-06 arterial road towards Silchar valley", distance_km: 22.1 },
    ],
  },
  "blk-3": {
    distance_km: 74,
    duration_text: "2h 45m",
    risk_score: 32,
    fuel_required_litres: 14.0,
    navigation_steps: [
      { step_number: 1, instruction: "Exit Dimapur ring road via Niuland connector", distance_km: 8.5 },
      { step_number: 2, instruction: "Follow ridge road bypassing rockfall overhang zone", distance_km: 34.0 },
      { step_number: 3, instruction: "Re-enter NH-29 at Kohima checkpost gate", distance_km: 12.0 },
    ],
  },
};

interface AIBlockageRerouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAlternateRoute?: (route: AlternateRouteData, blockage: Blockage) => void;
}

export default function AIBlockageRerouteModal({
  isOpen,
  onClose,
  onApplyAlternateRoute,
}: AIBlockageRerouteModalProps) {
  const [blockages] = useState<Blockage[]>(DEFAULT_BLOCKAGES);
  const [selectedId, setSelectedId] = useState<string>("blk-1");
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

  if (!isOpen) return null;

  const currentBlockage = blockages.find((b) => b.blockage_id === selectedId) || blockages[0];
  const alternateData = DEFAULT_ALTERNATES[selectedId] || DEFAULT_ALTERNATES["blk-1"];

  const handleSelectBlockage = (id: string) => {
    setIsLoading(true);
    setSelectedId(id);
    setApplied(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 350);
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
                  AI Road Blockage & Alternate Detour Engine
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-black border border-red-500/40">
                  ACTIVE BLOCKAGE
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

          {/* AI Alternate Route Recommendation Panel */}
          {isLoading ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <RefreshCw size={24} className="animate-spin text-cyan-400" />
              <span className="text-sm font-semibold text-slate-300">
                Calculating AI bypass contour & hazard delta...
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
                        AI Recommended Bypass Corridor
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
                <span>Apply AI Bypass Detour</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


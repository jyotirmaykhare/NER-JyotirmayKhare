"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Car,
  Clock,
  Compass,
  MapPin,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  ChevronRight,
  Sun,
  Moon,
  Volume2,
  X,
  Radio,
} from "lucide-react";

export function DriverHudView() {
  const { setIsDriverHudOpen, showNotification } = useApp();

  const [isNightMode, setIsNightMode] = useState(true);
  const [currentSpeed, setCurrentSpeed] = useState(48);

  const handleQuickReport = () => {
    showNotification(
      "Hazard Transmitted",
      "1-Tap Driver Hazard Report logged at current GPS waypoint.",
      "warning"
    );
  };

  const handleSos = () => {
    showNotification(
      "SOS Signal Broadcast",
      "Emergency distress beacon dispatched to BRO Sector Command & Highway Patrol.",
      "error"
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col p-4 sm:p-8 select-none transition-colors duration-300 ${
        isNightMode ? "bg-black text-white" : "bg-slate-100 text-slate-950"
      }`}
    >
      {/* Top HUD Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-black tracking-widest text-amber-400">
              DRIVER HUD • HIGH-CONTRAST IN-CAB MODE
            </div>
            <div className="text-sm font-bold text-slate-300">
              Vehicle AS-01-4582 • Medical Convoy
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Night / Day Contrast Switch */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Toggle Night/Day High Contrast"
          >
            {isNightMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Exit HUD Button */}
          <button
            onClick={() => setIsDriverHudOpen(false)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 font-bold text-xs uppercase tracking-wider text-slate-200 cursor-pointer flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>EXIT HUD</span>
          </button>
        </div>
      </div>

      {/* Main Large Driver Information Display */}
      <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full py-4 space-y-6">
        {/* DESTINATION & ETA HERO BOX (from specification:
            TAWANG
            ETA 02:14
            ROAD 🟢 OPEN
            NEXT CHECKPOINT Bomdila) */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border-2 transition-all ${
            isNightMode
              ? "bg-slate-950 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              : "bg-white border-slate-300 shadow-2xl"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="text-xs sm:text-sm uppercase tracking-widest font-bold text-slate-500 mb-1">
                CURRENT TARGET DESTINATION
              </div>
              <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white">
                TAWANG
              </h1>
              <div className="text-sm font-semibold text-sky-400 mt-1">
                Via Sela All-Weather Tunnel (NH-13 Corridor)
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs sm:text-sm uppercase tracking-widest font-bold text-slate-500 mb-1">
                ESTIMATED ARRIVAL (ETA)
              </div>
              <div className="text-4xl sm:text-6xl font-black font-mono text-emerald-400 tracking-tight">
                02:14
              </div>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                68 KM REMAINING • 48 KM/H AVG
              </div>
            </div>
          </div>

          {/* ROAD STATUS & NEXT CHECKPOINT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">
                ROAD SURFACE STATUS
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 text-xl sm:text-2xl font-black uppercase tracking-wider">
                <span className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
                <span>🟢 ROAD OPEN</span>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Passable with standard winter caution. Sela Tunnel clearance confirmed.
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-2">
                NEXT MAJOR CHECKPOINT
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-amber-400" />
                <span>Bomdila Transit Post</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                Distance to Checkpoint: <strong>14.2 KM</strong> (Approx 22 mins)
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts Ticker for Drivers */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-600/70 text-amber-300 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            CAUTION AHEAD: Light mountain scree near KM 41. Keep 40m vehicle spacing. High-beam fog lights advised.
          </div>
        </div>

        {/* Huge Touch Controls for One-Handed Cab Usability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleQuickReport}
            className="py-5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
          >
            <AlertTriangle className="w-6 h-6" />
            <span>REPORT ROAD HAZARD</span>
          </button>

          <button
            onClick={() =>
              showNotification(
                "Alternative Route",
                "Switching to Kalaktang Secondary Bypass (ETA +32 mins)",
                "info"
              )
            }
            className="py-5 px-6 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6 text-sky-400" />
            <span>SWITCH ALTERNATE</span>
          </button>

          <button
            onClick={handleSos}
            className="py-5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-950/60 cursor-pointer"
          >
            <ShieldAlert className="w-6 h-6" />
            <span>SOS EMERGENCY ASSIST</span>
          </button>
        </div>
      </div>
    </div>
  );
}

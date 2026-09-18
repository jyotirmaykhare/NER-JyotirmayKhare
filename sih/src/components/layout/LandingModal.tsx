"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  Compass,
  GitFork,
  Truck,
  ShieldAlert,
  ArrowRight,
  MapPin,
  CheckCircle2,
  X,
} from "lucide-react";
import { NE_STATES } from "@/data/states";

export function LandingModal() {
  const { isLandingPageOpen, setIsLandingPageOpen, setActiveTab, setIsLoginModalOpen } = useApp();

  if (!isLandingPageOpen) return null;

  const handleEnterPlatform = () => {
    setIsLandingPageOpen(false);
    setActiveTab("overview");
  };

  const sections = [
    {
      title: "MONITOR",
      subtitle: "Real-time accessibility visibility.",
      desc: "Live GIS telemetry across NH-13, NH-15, NH-27, and strategic bridge river levels over the Brahmaputra, Barak, and Lohit.",
      icon: Activity,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/40",
    },
    {
      title: "PREDICT",
      subtitle: "Identify potential disruptions before they occur.",
      desc: "Early warning models analyzing rainfall precipitation radar, mountain soil moisture, slope stability, and scree hazard.",
      icon: Compass,
      color: "text-amber-400 bg-amber-950/60 border-amber-800/40",
    },
    {
      title: "OPTIMIZE",
      subtitle: "Find safer alternate routes.",
      desc: "Intelligent corridor planner comparing delay indices, high-risk bypasses, and all-weather elevated alternatives.",
      icon: GitFork,
      color: "text-sky-400 bg-sky-950/60 border-sky-800/40",
    },
    {
      title: "TRACK",
      subtitle: "Monitor essential supplies and vehicles.",
      desc: "End-to-end cold chain tracking for vaccines, food grains, and petroleum convoys with simulated real-time GPS.",
      icon: Truck,
      color: "text-purple-400 bg-purple-950/60 border-purple-800/40",
    },
    {
      title: "RESPOND",
      subtitle: "Coordinate emergency logistics.",
      desc: "Privileged command center for flood disaster relief, NDRF resource deployment, green corridors, and broadcast alerts.",
      icon: ShieldAlert,
      color: "text-red-400 bg-red-950/60 border-red-800/40",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start p-4 sm:p-8">
      {/* Top Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between py-2 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-sky-600 flex items-center justify-center text-white font-extrabold text-xs">
            NER
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            NER LOGISTICS INTELLIGENCE
          </span>
        </div>
        <button
          onClick={handleEnterPlatform}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          title="Close Landing View"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-sky-400 mb-6 shadow-sm">
          <span>Smart India Hackathon (SIH) Regional Prototype</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
          NER LOGISTICS <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">
            INTELLIGENCE
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
          AI-powered logistics and accessibility intelligence for India&apos;s North Eastern Region.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            onClick={handleEnterPlatform}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-xl shadow-sky-900/30 transition-all cursor-pointer"
          >
            <span>ACCESS PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsLandingPageOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            <span>SIGN IN / DEMO ROLES</span>
          </button>
        </div>

        {/* Simplified NER Map Visualization Card */}
        <div className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-12 text-left backdrop-blur shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Regional Coverage Overview
              </div>
              <div className="text-sm font-semibold text-slate-200">
                8 North Eastern States • Strategic Corridors & Arterial Bridges
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Accessible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Watch Alert
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Severe Risk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NE_STATES.map((state) => {
              const riskColor =
                state.riskLevel === "Severe"
                  ? "border-red-900/60 bg-red-950/30 text-red-300"
                  : state.riskLevel === "High"
                  ? "border-orange-900/60 bg-orange-950/30 text-orange-300"
                  : state.riskLevel === "Moderate"
                  ? "border-amber-900/60 bg-amber-950/30 text-amber-300"
                  : "border-emerald-900/60 bg-emerald-950/30 text-emerald-300";

              return (
                <div
                  key={state.id}
                  className={`p-3 rounded-lg border flex flex-col justify-between ${riskColor}`}
                >
                  <div>
                    <div className="font-bold text-xs text-white">{state.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">HQ: {state.capital}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Road Open:</span>
                    <span className="font-bold">{state.openRoadsPercentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5 Core Pillars (MONITOR, PREDICT, OPTIMIZE, TRACK, RESPOND) */}
        <div className="w-full mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Core Operational Capabilities
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-left">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.title}
                  className="p-4 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div
                      className={`w-9 h-9 rounded-md border flex items-center justify-center mb-3 ${sec.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-black text-xs text-white tracking-wider mb-1">
                      {sec.title}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 mb-2">
                      {sec.subtitle}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Access Banner */}
        <div className="w-full py-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Built for Smart India Hackathon • Ministry of Development of North Eastern Region (MDoNER)
          </div>
          <button
            onClick={handleEnterPlatform}
            className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors cursor-pointer"
          >
            ENTER COMMAND CENTER
          </button>
        </div>
      </div>
    </div>
  );
}

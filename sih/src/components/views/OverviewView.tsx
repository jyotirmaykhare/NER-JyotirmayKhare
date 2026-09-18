"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import MapContainer from "@/components/map/MapContainer";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import {
  Activity,
  AlertTriangle,
  Truck,
  Package,
  Clock,
  ShieldAlert,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  MapPin,
} from "lucide-react";
import { Road } from "@/types";

export function OverviewView() {
  const {
    roads,
    vehicles,
    shipments,
    incidents,
    selectedRoad,
    setSelectedRoad,
    focusOnLocation,
    setActiveTab,
  } = useApp();

  // Active AI Risk Detection example from prompt:
  // Landslide probability 78%, Location: West Siang, Expected: Next 3-5 hours
  const featuredAiAlert = {
    title: "AI RISK DETECTION",
    type: "Landslide probability",
    probability: 78,
    location: "West Siang Sector (KM 48)",
    expected: "Next 3–5 hours",
    factors: [
      "Heavy rainfall (142mm/24h radar telemetry)",
      "Steep phyllite mountain terrain",
      "Historical slope slip frequency (High)",
      "Saturated road embankment base",
    ],
    lat: 28.18,
    lng: 94.95,
  };

  const handleViewAiOnMap = () => {
    focusOnLocation(featuredAiAlert.lat, featuredAiAlert.lng, 9, featuredAiAlert.location);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              NER LOGISTICS INTELLIGENCE
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              REGIONAL OPERATIONS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interstate Transit, Terrain Vulnerability & Supply Chain Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">System Status:</span>
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ● Operational
            </span>
          </div>
        </div>
      </div>

      {/* Compact Metrics Row (6 items from specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <StatCard
          label="Road Accessibility"
          value="78%"
          subValue="All Corridors"
          trend="safe"
          trendText="8,420 km Open"
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
          onClick={() => setActiveTab("accessibility")}
        />
        <StatCard
          label="Active Disruptions"
          value="23"
          subValue="Incidents"
          trend="danger"
          trendText="9 Landslides"
          icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
          onClick={() => setActiveTab("alerts")}
        />
        <StatCard
          label="Vehicles In Transit"
          value="146"
          subValue="Active Units"
          trend="safe"
          trendText="112 On Schedule"
          icon={<Truck className="w-4 h-4 text-sky-400" />}
          onClick={() => setActiveTab("vehicles")}
        />
        <StatCard
          label="Active Shipments"
          value="892"
          subValue="Consignments"
          trend="safe"
          trendText="Cold Chain Priority"
          icon={<Package className="w-4 h-4 text-purple-400" />}
          onClick={() => setActiveTab("shipments")}
        />
        <StatCard
          label="Delayed Shipments"
          value="41"
          subValue="Avg +2.4h"
          trend="danger"
          trendText="Weather & River"
          icon={<Clock className="w-4 h-4 text-amber-400" />}
          onClick={() => setActiveTab("shipments")}
        />
        <StatCard
          label="High Risk Corridors"
          value="12"
          subValue="Monitored"
          trend="danger"
          trendText="West Siang / NH-13"
          icon={<ShieldAlert className="w-4 h-4 text-orange-400" />}
          onClick={() => setActiveTab("accessibility")}
        />
      </div>

      {/* Main Dashboard Layout: Large GIS Map + Side Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Large Interactive GIS Map */}
        <div className="lg:col-span-8 flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Regional GIS Map
              </span>
              <span className="text-[10px] text-slate-400">
                (Click any corridor, bridge or vehicle for details)
              </span>
            </div>
            <button
              onClick={() => setActiveTab("map")}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Full Screen GIS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 w-full relative">
            <MapContainer height="h-[520px]" />
          </div>
        </div>

        {/* Side Panels: AI Intelligence & Active Alerts */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          {/* AI Intelligence Panel */}
          <div className="rounded-lg border border-sky-900/40 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span className="text-xs font-black text-sky-400 tracking-wider uppercase">
                  {featuredAiAlert.title}
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                HIGH PRIORITY
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Anomaly Type:</span>
                <span className="font-bold text-white">{featuredAiAlert.type}</span>
              </div>

              <div>
                <RiskIndicator score={featuredAiAlert.probability} size="sm" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Location:</span>
                <span className="font-bold text-amber-300">{featuredAiAlert.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Expected Timeframe:</span>
                <span className="font-bold text-red-400">{featuredAiAlert.expected}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-semibold text-slate-300 mb-1">
                  Contributing Factors:
                </div>
                <ul className="space-y-1 text-[11px] text-slate-400 pl-3">
                  {featuredAiAlert.factors.map((factor, idx) => (
                    <li key={idx} className="list-disc">
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleViewAiOnMap}
                  className="w-full py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-950/50"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>VIEW ON MAP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Alerts List */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-md flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  ACTIVE ALERTS
                </span>
              </div>
              <button
                onClick={() => setActiveTab("alerts")}
                className="text-[11px] text-sky-400 hover:underline font-semibold"
              >
                View All (23)
              </button>
            </div>

            {/* Structured Alert Items from Prompt:
                🔴 Road blocked
                🟠 Heavy rainfall
                🟡 Vehicle delayed
                🟡 Bridge inspection required
            */}
            <div className="space-y-2 overflow-y-auto max-h-60 text-xs">
              <div
                onClick={() => {
                  focusOnLocation(28.18, 94.95, 9, "NH-13 Blocked");
                  const road = roads.find((r) => r.code === "NH-13");
                  if (road) setSelectedRoad(road);
                }}
                className="p-2.5 rounded border border-red-900/60 bg-red-950/30 hover:bg-red-950/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    <span>🔴</span> ROAD BLOCKED
                  </span>
                  <span className="text-[10px] text-slate-400">12m ago</span>
                </div>
                <div className="text-slate-300 font-medium">NH-13 Trans-Arunachal Highway</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Debris mudslide at KM 48. Diversion via Pangin active.
                </div>
              </div>

              <div
                onClick={() => {
                  focusOnLocation(26.83, 93.65, 8, "Tezpur Heavy Rain");
                }}
                className="p-2.5 rounded border border-orange-900/60 bg-orange-950/30 hover:bg-orange-950/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-orange-400 flex items-center gap-1">
                    <span>🟠</span> HEAVY RAINFALL
                  </span>
                  <span className="text-[10px] text-slate-400">25m ago</span>
                </div>
                <div className="text-slate-300 font-medium">Brahmaputra Valley (Tezpur - Dhemaji)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  98.4mm rain in 24h. Embankment erosion along NH-15.
                </div>
              </div>

              <div
                onClick={() => {
                  setActiveTab("vehicles");
                }}
                className="p-2.5 rounded border border-amber-900/60 bg-amber-950/30 hover:bg-amber-950/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <span>🟡</span> VEHICLE DELAYED
                  </span>
                  <span className="text-[10px] text-slate-400">MN-04-1298</span>
                </div>
                <div className="text-slate-300 font-medium">Relief Rice Grain Convoy (Imphal → Ukhrul)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Delayed +4h 30m due to single-lane clearance.
                </div>
              </div>

              <div
                onClick={() => {
                  setActiveTab("accessibility");
                }}
                className="p-2.5 rounded border border-amber-900/60 bg-amber-950/30 hover:bg-amber-950/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <span>🟡</span> BRIDGE INSPECTION REQUIRED
                  </span>
                  <span className="text-[10px] text-slate-400">Bridge #04</span>
                </div>
                <div className="text-slate-300 font-medium">Silchar Barak River Bridge (Cachar)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Water at 20.4m (Danger mark 21.0m). Multi-axle speed limit 20 km/h.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Road Inspection Compact Card (when road clicked) */}
      {selectedRoad && (
        <div className="p-4 rounded-lg border border-sky-600/70 bg-slate-900 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                SELECTED CORRIDOR INSPECTION
              </span>
              <StatusBadge status={selectedRoad.status} size="sm" />
            </div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>{selectedRoad.code}</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="text-slate-200">{selectedRoad.name}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-500">Sector:</span> {selectedRoad.startPoint} → {selectedRoad.endPoint}
              </div>
              <div>
                <span className="text-slate-500">Disruption Risk:</span>{" "}
                <span className="text-amber-400 font-bold">{selectedRoad.riskScore}%</span>
              </div>
              <div>
                <span className="text-slate-500">Weather:</span> {selectedRoad.weather.split("(")[0]}
              </div>
              <div>
                <span className="text-slate-500">Delay:</span>{" "}
                <span className="text-red-400 font-bold">
                  +{Math.floor(selectedRoad.estimatedDelayMinutes / 60)}h {selectedRoad.estimatedDelayMinutes % 60}m
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-sky-400 font-bold">AI Recommendation: </span>
              {selectedRoad.aiRecommendation}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedRoad.alternateRouteCode && (
              <button
                onClick={() => {
                  setActiveTab("routes");
                }}
                className="px-3 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                VIEW ALTERNATIVE
              </button>
            )}
            <button
              onClick={() => setSelectedRoad(null)}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

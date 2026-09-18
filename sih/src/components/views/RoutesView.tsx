"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RouteOption } from "@/types";
import MapContainer from "@/components/map/MapContainer";
import {
  GitFork,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";
import AIBlockageRerouteModal from "@/components/modals/AIBlockageRerouteModal";

export function RoutesView() {
  const { focusOnLocation } = useApp();

  const [fromCity, setFromCity] = useState("Guwahati Central Hub");
  const [toCity, setToCity] = useState("Tawang District Hospital");
  const [commodity, setCommodity] = useState("Medical Supplies");
  const [vehicleType, setVehicleType] = useState("Truck (Heavy All-Weather)");
  const [priority, setPriority] = useState<"Normal" | "High" | "Critical">("High");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [selectedRouteId, setSelectedRouteId] = useState("route-rec");
  const [isBlockageModalOpen, setIsBlockageModalOpen] = useState(false);

  // Route Options (Matching prompt specification)
  const routeOptions: RouteOption[] = [
    {
      id: "route-rec",
      name: "Primary Sela Tunnel Corridor (NH-13 / Green Corridor Alpha)",
      isRecommended: true,
      distanceKm: 495,
      eta: "11h 42m",
      riskScore: 21,
      accessibilityPercentage: 94,
      expectedDelay: "+18 mins",
      reasoning: "18 km longer but 34% lower disruption risk. Bypasses active scree slide near old Sela pass via newly engineered all-weather tunnel.",
      waypoints: ["Guwahati Depot", "Balipara Junction", "Bhalukpong Gate", "Dirang Valley", "Sela Tunnel", "Tawang HQ"],
      coordinates: [
        [26.1445, 91.7362],
        [26.6338, 92.7926],
        [27.0100, 92.6500],
        [27.3500, 92.2400],
        [27.5000, 92.0900],
        [27.5861, 91.8594],
      ],
    },
    {
      id: "route-alt-b",
      name: "Alternate Route B (Via Orang - Kalaktang - Rupa Bypass)",
      isRecommended: false,
      distanceKm: 477,
      eta: "13h 15m",
      riskScore: 54,
      accessibilityPercentage: 72,
      expectedDelay: "+1h 45m",
      reasoning: "Shorter distance by 18 km, but moderate risk of boulder roll near Kalaktang gorge due to morning drizzle.",
      waypoints: ["Guwahati Hub", "Mangaldai", "Orang National Park", "Kalaktang", "Bomdila", "Tawang"],
      coordinates: [
        [26.1445, 91.7362],
        [26.4300, 92.0300],
        [26.9800, 92.1200],
        [27.2645, 92.4200],
        [27.5861, 91.8594],
      ],
    },
    {
      id: "route-alt-c",
      name: "Northern Foothills Emergency Escort Corridor",
      isRecommended: false,
      distanceKm: 540,
      eta: "15h 30m",
      riskScore: 78,
      accessibilityPercentage: 58,
      expectedDelay: "+3h 20m",
      reasoning: "Only recommended if primary Sela tunnel faces military convoy priority. Waterlogging active near footbridge KM 112.",
      waypoints: ["Guwahati", "Tezpur Military Base", "Pangin Divergence", "Tawang"],
      coordinates: [
        [26.1445, 91.7362],
        [26.6338, 92.7926],
        [27.5861, 91.8594],
      ],
    },
  ];

  const handleFindRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      // Focus on midpoint
      focusOnLocation(27.0, 92.3, 8, "Recommended Route: Guwahati to Tawang");
    }, 500);
  };

  const activeRoute = routeOptions.find((r) => r.id === selectedRouteId) || routeOptions[0];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              ROUTE INTELLIGENCE & CORRIDOR OPTIMIZATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI Risk-Weighted Multi-Criteria Route Planning across North Eastern Mountain Corridors
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBlockageModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>AI Blockage Detour Engine</span>
        </button>
      </div>

      {/* Query Formulation Form */}
      <form
        onSubmit={handleFindRoute}
        className="p-4 rounded-lg border border-slate-800 bg-slate-900/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs"
      >
        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Origin Hub (From)
          </label>
          <select
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="Guwahati Central Hub">Guwahati Central Hub (Assam)</option>
            <option value="Tezpur Logistics Depot">Tezpur Logistics Depot (Assam)</option>
            <option value="Dibrugarh Railhead">Dibrugarh Railhead (Assam)</option>
            <option value="Shillong Transit Base">Shillong Transit Base (Meghalaya)</option>
            <option value="Silchar Supply Godown">Silchar Supply Godown (Assam)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Destination (To)
          </label>
          <select
            value={toCity}
            onChange={(e) => setToCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="Tawang District Hospital">Tawang District Hospital (Arunachal)</option>
            <option value="Aalo / West Siang Relief Station">Aalo / West Siang Relief (Arunachal)</option>
            <option value="Ukhrul Sub-depot">Ukhrul Sub-depot (Manipur)</option>
            <option value="Champhai Border Post">Champhai Border Post (Mizoram)</option>
            <option value="Mon Outpost">Mon Outpost (Nagaland)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Commodity
          </label>
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="Medical Supplies">Medical Supplies (Cold-Chain)</option>
            <option value="Essential Food Grains">Essential Food Grains (FCI)</option>
            <option value="Petroleum & Diesel">Petroleum & Diesel Tanker</option>
            <option value="Heavy Engineering">Heavy Engineering / Earthmovers</option>
            <option value="Disaster Relief Kits">Disaster Relief Kits</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Vehicle Profile
          </label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="Truck (Heavy All-Weather)">Heavy Multi-Axle Truck</option>
            <option value="4x4 High-Clearance">4x4 High-Clearance Medium Carrier</option>
            <option value="Light Commercial Van">Light Commercial Van (Fast Courier)</option>
            <option value="Tanker Unit">Insulated Hazardous Tanker</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
            Priority Level
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as "Normal" | "High" | "Critical")}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="Normal">Normal Commercial</option>
            <option value="High">High Strategic Priority</option>
            <option value="Critical">Critical Emergency Lifeline</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-950/50"
          >
            {isSearching ? (
              <span>Calculating...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>FIND ROUTE</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Main Area: GIS Corridor Map + Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Route Cards Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Evaluated Route Alternatives ({routeOptions.length})</span>
            <span className="text-slate-500 font-normal">Ranked by AI safety score</span>
          </div>

          {routeOptions.map((route) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <div
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  focusOnLocation(route.coordinates[2][0], route.coordinates[2][1], 8, route.name);
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "border-sky-500 bg-sky-950/20 shadow-lg"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                {/* Badge Header */}
                <div className="flex items-center justify-between mb-2">
                  {route.isRecommended ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 uppercase tracking-wide">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      RECOMMENDED
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      ALTERNATIVE ROUTE
                    </span>
                  )}
                  <span className="text-xs font-bold text-white font-mono">{route.distanceKm} km</span>
                </div>

                <h3 className="font-bold text-xs text-white mb-2">{route.name}</h3>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] mb-2.5">
                  <div>
                    <div className="text-slate-500">ETA</div>
                    <div className="font-bold text-white">{route.eta}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Risk Score</div>
                    <div
                      className={`font-bold ${
                        route.riskScore > 60
                          ? "text-red-400"
                          : route.riskScore > 35
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {route.riskScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500">Delay Offset</div>
                    <div className="font-bold text-amber-300">{route.expectedDelay}</div>
                  </div>
                </div>

                {/* AI Reasoning (From Specification) */}
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-sky-400">AI Reason: </span>
                  &ldquo;{route.reasoning}&rdquo;
                </div>

                {/* Waypoints Timeline */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-400 pb-1">
                  {route.waypoints.map((wp, idx) => (
                    <React.Fragment key={idx}>
                      <span className="whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {wp}
                      </span>
                      {idx < route.waypoints.length - 1 && <span>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Route Map Preview */}
        <div className="lg:col-span-7 flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Corridor Path Visualizer
            </div>
            <div className="text-xs text-sky-400 font-semibold flex items-center gap-1">
              <span>Path: {fromCity.split(" ")[0]} → {toCity.split(" ")[0]}</span>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <MapContainer height="h-[520px]" />
          </div>
        </div>
      </div>

      {/* AI Blockage Reroute Modal */}
      <AIBlockageRerouteModal
        isOpen={isBlockageModalOpen}
        onClose={() => setIsBlockageModalOpen(false)}
      />
    </div>
  );
}

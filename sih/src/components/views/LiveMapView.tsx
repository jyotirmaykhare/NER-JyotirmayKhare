"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import MapContainer from "@/components/map/MapContainer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { NE_STATES } from "@/data/states";
import {
  Map,
  Compass,
  Layers,
  MapPin,
  Truck,
  AlertTriangle,
  Activity,
  ArrowRight,
  Info,
} from "lucide-react";

export function LiveMapView() {
  const {
    selectedRoad,
    setSelectedRoad,
    selectedVehicle,
    setSelectedVehicle,
    selectedIncident,
    setSelectedIncident,
    focusOnLocation,
    setActiveTab,
  } = useApp();

  const [activeStateFilter, setActiveStateFilter] = useState("all");

  const handleStateClick = (state: (typeof NE_STATES)[0]) => {
    setActiveStateFilter(state.id);
    focusOnLocation(state.coordinates[0], state.coordinates[1], 8, state.name);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              NORTH EASTERN REGIONAL GIS & LOGISTICS CORRIDORS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interstate Highway Telemetry, River Basins, Active Fleet Convoys & Geotechnical Vulnerability
          </p>
        </div>

        {/* State Quick Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <button
            onClick={() => {
              setActiveStateFilter("all");
              focusOnLocation(26.3, 92.9, 7, "North Eastern Region");
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors shrink-0 ${
              activeStateFilter === "all"
                ? "bg-sky-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            All 8 States
          </button>
          {NE_STATES.map((state) => (
            <button
              key={state.id}
              onClick={() => handleStateClick(state)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors shrink-0 ${
                activeStateFilter === state.id
                  ? "bg-sky-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {state.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full GIS Map Display */}
      <div className="flex-1 min-h-[550px] relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        <MapContainer height="h-[600px]" />
      </div>

      {/* Quick Selected Entity Summary Bottom Bar */}
      {(selectedRoad || selectedVehicle || selectedIncident) && (
        <div className="p-3 rounded-lg border border-sky-600/50 bg-slate-900 shadow-xl flex items-center justify-between gap-4 text-xs animate-in slide-in-from-bottom-1">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping shrink-0" />
            {selectedRoad && (
              <div>
                <span className="font-bold text-white font-mono">{selectedRoad.code}</span>:{" "}
                <span className="text-slate-300">{selectedRoad.name}</span> (Risk:{" "}
                <strong className="text-amber-400">{selectedRoad.riskScore}%</strong>)
              </div>
            )}
            {selectedVehicle && (
              <div>
                <span className="font-bold text-white font-mono">{selectedVehicle.plateNumber}</span>:{" "}
                <span className="text-slate-300">{selectedVehicle.cargo}</span> (ETA:{" "}
                <strong className="text-emerald-400">{selectedVehicle.eta}</strong>)
              </div>
            )}
            {selectedIncident && (
              <div>
                <span className="font-bold text-red-400 font-mono">{selectedIncident.id}</span>:{" "}
                <span className="text-slate-300">{selectedIncident.title}</span> (Delay:{" "}
                <strong className="text-amber-400">+{selectedIncident.estimatedDelayHours}h</strong>)
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedRoad(null);
              setSelectedVehicle(null);
              setSelectedIncident(null);
            }}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0 font-semibold"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

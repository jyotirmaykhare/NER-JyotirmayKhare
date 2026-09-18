"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Incident, IncidentType, IncidentSeverity } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import {
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

export function AlertsView() {
  const { incidents, focusOnLocation, setSelectedIncident, setActiveTab } = useApp();

  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const incidentTypes: IncidentType[] = [
    "Landslide",
    "Flood",
    "Heavy Rain",
    "Road Damage",
    "Bridge Failure",
    "Traffic",
    "Weather",
  ];

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.cause.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || inc.type === selectedType;
    const matchesSeverity = selectedSeverity === "all" || inc.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const handleViewOnMap = (incident: Incident) => {
    setSelectedIncident(incident);
    focusOnLocation(incident.coordinates[0], incident.coordinates[1], 10, incident.title);
    setActiveTab("map");
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              DISRUPTION INTELLIGENCE & INCIDENT TELEMETRY
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-Time Hazard Detection, Landslide Probabilities & Multi-Agency Ground Incident Feeds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Active Incidents:</span>
          <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-mono font-bold text-xs">
            {incidents.length} Reported
          </span>
        </div>
      </div>

      {/* Filter and Category Ribbon */}
      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search Location, Cause or Sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors shrink-0 ${
              selectedType === "all"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Categories
          </button>
          {incidentTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors shrink-0 ${
                selectedType === type
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Disruption Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 flex-1">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            className="p-4 rounded-lg border border-slate-800 bg-slate-900/80 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80 mb-2">
                <span className="font-mono font-bold text-xs text-sky-400">{inc.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {inc.type}
                  </span>
                  <StatusBadge status={inc.severity} size="sm" />
                </div>
              </div>

              {/* Title & Location */}
              <h3 className="font-bold text-xs text-white mb-1 leading-snug">{inc.title}</h3>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium truncate">{inc.location}</span>
              </div>

              {/* Cause & Affected Routes */}
              <div className="space-y-1 text-xs text-slate-300 p-2 rounded bg-slate-950 border border-slate-800/80 mb-2">
                <div>
                  <span className="text-slate-500 font-medium">Cause:</span> {inc.cause}
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Affected:</span>{" "}
                  <span className="text-red-400 font-mono font-bold">
                    {inc.affectedRoutes.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Est. Delay:</span>{" "}
                  <strong className="text-amber-300 font-mono">+{inc.estimatedDelayHours} Hours</strong>
                </div>
              </div>

              {/* AI Prediction Box (from specification) */}
              <div className="p-2.5 rounded bg-sky-950/30 border border-sky-900/50 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-sky-400 font-bold uppercase text-[10px] tracking-wider">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    AI Risk Prediction
                  </span>
                  <span>{inc.aiProbability}% PROBABILITY</span>
                </div>
                <div className="text-slate-300 leading-relaxed italic">
                  &ldquo;{inc.aiPredictionText}&rdquo;
                </div>
              </div>
            </div>

            {/* Footer with Timestamp and Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{inc.timeDetected}</span>
              </span>

              <button
                onClick={() => handleViewOnMap(inc)}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer shadow-md"
              >
                <span>VIEW ON MAP</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

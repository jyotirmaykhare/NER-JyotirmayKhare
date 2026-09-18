"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Shipment } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Thermometer,
  ShieldAlert,
  ArrowRight,
  Truck,
  Building,
  Check,
  AlertCircle,
} from "lucide-react";

export function ShipmentsView() {
  const { shipments, selectedShipment, setSelectedShipment } = useApp();

  const [searchId, setSearchId] = useState("");
  const activeShipment = selectedShipment || shipments[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const found = shipments.find(
      (s) =>
        s.id.toLowerCase().includes(searchId.toLowerCase()) ||
        s.title.toLowerCase().includes(searchId.toLowerCase()) ||
        s.commodity.toLowerCase().includes(searchId.toLowerCase())
    );
    if (found) {
      setSelectedShipment(found);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              ESSENTIAL SHIPMENT & SUPPLY CHAIN TRACKER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-End Multimodal Consignment Visibility for North Eastern Lifelines
          </p>
        </div>

        {/* Quick Search Input */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Track Consignment (e.g. NER-MED-20491)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            TRACK
          </button>
        </form>
      </div>

      {/* Main Active Shipment Card (Shiprocket / DHL Inspired Experience) */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/80 shadow-2xl space-y-6">
        {/* Top Info Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">WAYBILL / TRACKING NO:</span>
              <span className="text-base sm:text-lg font-black font-mono text-sky-400 tracking-wider">
                {activeShipment.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-300 border border-red-700">
                {activeShipment.priority} PRIORITY
              </span>
            </div>
            <h2 className="text-sm font-bold text-white mt-1">{activeShipment.title}</h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Commodity: <span className="text-slate-200 font-semibold">{activeShipment.commodity}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Estimated Delivery</div>
              <div className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{activeShipment.eta}</span>
              </div>
            </div>

            {activeShipment.temperatureControlled && (
              <div className="pl-4 border-l border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cold-Chain Temp</div>
                <div className="text-lg font-black text-sky-400 font-mono flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-sky-400" />
                  <span>{activeShipment.currentTempCelsius}°C</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Steps Timeline (Guwahati -> Tezpur -> Bomdila -> Tawang) */}
        <div className="py-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Transit Milestones & Checkpoint Progression
          </div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2">
            {activeShipment.stops.map((stop, idx) => {
              const isCompleted = stop.status === "completed";
              const isCurrent = stop.status === "current";
              const isPending = stop.status === "pending";

              return (
                <div key={idx} className="flex-1 relative flex md:flex-col items-center gap-3 md:text-center w-full">
                  {/* Step Connector Line (Desktop) */}
                  {idx < activeShipment.stops.length - 1 && (
                    <div
                      className={`hidden md:block absolute top-4 left-1/2 w-full h-0.5 z-0 ${
                        isCompleted ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                    />
                  )}

                  {/* Step Icon Badge */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${
                      isCompleted
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                        : isCurrent
                        ? "bg-sky-500 text-slate-950 ring-4 ring-sky-950 animate-pulse font-black"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : isCurrent ? "●" : "○"}
                  </div>

                  {/* Stop Text Content */}
                  <div className="flex-1 md:w-full">
                    <div className="font-bold text-xs text-white uppercase tracking-tight">
                      {stop.name}
                    </div>
                    <div
                      className={`text-[11px] font-semibold mt-0.5 ${
                        isCurrent
                          ? "text-sky-400"
                          : isCompleted
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓ Completed" : isCurrent ? "● Current Location" : "○ Destination"}
                    </div>
                    {stop.timestamp && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {stop.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consignment Logistics Detail Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
              Dispatching Authority
            </span>
            <div className="font-semibold text-white">{activeShipment.senderOrg}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Origin: {activeShipment.origin}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
              Receiving Health Center / Base
            </span>
            <div className="font-semibold text-white">{activeShipment.receiverOrg}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Destination: {activeShipment.destination}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
              Freight Manifest
            </span>
            <div className="font-semibold text-white">Gross Weight: {activeShipment.weightKg} kg</div>
            <div className="text-[11px] text-sky-400 font-mono mt-0.5">
              Assigned Escort Vehicle: {activeShipment.vehicleId || "Direct Carrier"}
            </div>
          </div>
        </div>
      </div>

      {/* All Available Active Shipments Picker */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Other Monitored Consignments ({shipments.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {shipments.map((s) => {
            const isSelected = activeShipment.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedShipment(s)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-sky-500 bg-sky-950/30 shadow-md"
                    : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-sky-400 text-xs">{s.id}</span>
                  <StatusBadge status={s.status} size="sm" />
                </div>
                <div className="font-bold text-xs text-white truncate mb-1">{s.title}</div>
                <div className="text-[11px] text-slate-400 mb-2">
                  {s.origin.split(" ")[0]} → {s.destination.split(" ")[0]}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80 text-slate-400 font-mono">
                  <span>ETA: <strong className="text-white">{s.eta}</strong></span>
                  <span>{s.weightKg} kg</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

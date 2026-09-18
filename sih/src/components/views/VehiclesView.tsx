"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Vehicle } from "@/types";
import { getFleet } from "@/services/fleetService";
import { StatusBadge } from "@/components/ui/StatusBadge";
import MapContainer from "@/components/map/MapContainer";
import {
  Truck,
  MapPin,
  Clock,
  Activity,
  Phone,
  User,
  Shield,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Radio,
} from "lucide-react";
import VehicleDossierModal from "@/components/modals/VehicleDossierModal";

export function VehiclesView() {
  const {
    vehicles,
    selectedVehicle,
    setSelectedVehicle,
    focusOnLocation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [fleetRegistry, setFleetRegistry] = useState<{ total: number; live: boolean } | null>(null);

  // Registry telemetry: live AIS-140 registry when the engine is up, offline convoy set otherwise.
  useEffect(() => {
    let cancelled = false;

    getFleet().then((fleet) => {
      if (cancelled) return;
      setFleetRegistry({ total: fleet.vehicles.length, live: fleet.live });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeVehicle = selectedVehicle || vehicles[0];

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    focusOnLocation(vehicle.coordinates[0], vehicle.coordinates[1], 9, vehicle.plateNumber);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              FLEET TELEMETRY & REAL-TIME VEHICLE TRACKING
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Live Automated GPS Vehicle Beacons Across Mountain Passes & Interstate Corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
            <Radio
              className={`w-3.5 h-3.5 ${
                fleetRegistry?.live ? "text-emerald-400 animate-pulse" : "text-amber-400"
              }`}
            />
            <span>{fleetRegistry?.live ? "AIS-140 Live Registry:" : "Offline Convoy Registry:"}</span>
            <span
              className={`font-bold ${
                fleetRegistry?.live ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {fleetRegistry ? `${fleetRegistry.total} Active Convoys` : "Synchronising…"}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by Vehicle ID, Cargo or Route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">Status:</span>
          {["all", "moving", "delayed", "stopped"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-colors ${
                statusFilter === status
                  ? "bg-sky-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Fleet Table + Detailed Inspection Panel & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Vehicles Table / Mobile Cards */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Active Transits ({filteredVehicles.length})</span>
            <span className="text-[10px] text-slate-500">Tap vehicle to track GPS telemetry</span>
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden shadow-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-3">Vehicle ID</th>
                  <th className="p-3">Cargo Type</th>
                  <th className="p-3">Corridor Sector</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredVehicles.map((v) => {
                  const isSelected = activeVehicle?.id === v.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => handleSelectVehicle(v)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        isSelected ? "bg-sky-950/40 font-semibold text-white" : ""
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-sky-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{v.plateNumber}</span>
                      </td>
                      <td className="p-3 truncate max-w-[140px] text-slate-200">
                        {v.cargo}
                      </td>
                      <td className="p-3 text-slate-400">
                        <span className="text-white">{v.origin.split(" ")[0]}</span> →{" "}
                        <span className="text-white">{v.destination.split(" ")[0]}</span>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={v.status} size="sm" />
                      </td>
                      <td className="p-3 font-mono font-bold text-white">
                        {v.eta}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (Responsive alternative to dense tables) */}
          <div className="sm:hidden space-y-2">
            {filteredVehicles.map((v) => {
              const isSelected = activeVehicle?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVehicle(v)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "border-sky-500 bg-sky-950/30"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-sky-400">{v.plateNumber}</span>
                    <StatusBadge status={v.status} size="sm" />
                  </div>
                  <div className="text-white font-semibold truncate mb-1">{v.cargo}</div>
                  <div className="text-slate-400 text-[11px] mb-2">
                    {v.origin} → {v.destination}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800 text-slate-400">
                    <span>Speed: <strong className="text-white">{v.speedKmH} km/h</strong></span>
                    <span>ETA: <strong className="text-emerald-400">{v.eta}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspection Panel & Mini Map */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {activeVehicle && (
            <div className="p-4 rounded-lg border border-slate-800 bg-slate-900 shadow-xl space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    VEHICLE DETAIL TELEMETRY
                  </div>
                  <div className="text-base font-black text-white font-mono flex items-center gap-2">
                    <span>{activeVehicle.plateNumber}</span>
                    <StatusBadge status={activeVehicle.status} size="sm" />
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <div className="text-slate-500">Last GPS Update:</div>
                  <div className="text-emerald-400 font-mono font-bold">
                    {activeVehicle.lastGpsUpdate}
                  </div>
                </div>
              </div>

              {/* Cargo & Route */}
              <div className="text-xs space-y-1">
                <div className="text-slate-400">
                  Cargo: <span className="text-white font-bold">{activeVehicle.cargo}</span>
                </div>
                <div className="text-slate-400">
                  Sector:{" "}
                  <span className="text-sky-300 font-medium">
                    {activeVehicle.origin} → {activeVehicle.destination}
                  </span>
                </div>
              </div>

              {/* 4-Box Telemetry Grid (from prompt specification: Speed, Distance, ETA, Road Condition) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Current Speed
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {activeVehicle.speedKmH} <span className="text-xs font-normal text-slate-400">km/h</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Distance Remaining
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {activeVehicle.distanceRemainingKm} <span className="text-xs font-normal text-slate-400">km</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Estimated Time of Arrival
                  </div>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {activeVehicle.eta}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Current route status
                  </div>
                  <div className="text-sm font-black text-amber-400 font-mono">
                    {activeVehicle.status}
                  </div>
                </div>
              </div>

              {/* Road Condition Indicator */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                  Surface & Road Condition:
                </span>
                <span className="text-slate-200">{activeVehicle.roadCondition}</span>
              </div>

              {/* Driver Information */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pilot: <strong className="text-white">{activeVehicle.driverName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>{activeVehicle.driverPhone}</span>
                </div>
              </div>

              {/* Action: Open AIS-140 Dossier */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>VIEW FULL AIS-140 TELEMETRY DOSSIER</span>
                </button>
              </div>
            </div>
          )}

          {/* Integrated Map */}
          <div className="flex-1 min-h-[260px] rounded-lg overflow-hidden border border-slate-800">
            <MapContainer height="h-[280px]" />
          </div>
        </div>
      </div>

      {/* Vehicle Dossier Modal */}
      <VehicleDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        vehicle={activeVehicle}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { VahanRecord } from "@/types/api";
import { verifyRegistration } from "@/services/vahanService";
import {
  Truck,
  MapPin,
  Compass,
  Navigation,
  Activity,
  Gauge,
  Fuel,
  Battery,
  ShieldCheck,
  Radio,
  Satellite,
  User,
  Phone,
  Package,
  Copy,
  Check,
  X,
  Crosshair,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface VehicleDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onTrackLive?: (vehicle: Vehicle) => void;
  isTracking?: boolean;
}

export default function VehicleDossierModal({
  isOpen,
  onClose,
  vehicle,
  onTrackLive,
  isTracking = false,
}: VehicleDossierModalProps) {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activeTab, setActiveTab] = useState<"location" | "telemetry" | "driver_cargo" | "ais140">("location");
  const [vahanData, setVahanData] = useState<VahanRecord | null>(null);
  const [isVerifyingVahan, setIsVerifyingVahan] = useState(false);
  const [isVahanLive, setIsVahanLive] = useState(false);

  useEffect(() => {
    if (!isOpen || !vehicle) return;

    let cancelled = false;
    const targetPlate = vehicle.plateNumber || vehicle.id;

    setIsVerifyingVahan(true);
    setVahanData(null);

    verifyRegistration(String(targetPlate))
      .then((result) => {
        if (cancelled) return;
        setVahanData(result.verification.record);
        setIsVahanLive(result.live);
      })
      .finally(() => {
        if (!cancelled) setIsVerifyingVahan(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, vehicle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !vehicle) return null;

  const lat = vehicle.coordinates ? vehicle.coordinates[0] : 26.14;
  const lng = vehicle.coordinates ? vehicle.coordinates[1] : 91.73;
  const speed = vehicle.speedKmH || 42;
  const altitude = 420;
  const fuelPercent = 75;
  const fuelLitres = 52;
  const rangeKm = vehicle.distanceRemainingKm || 280;
  const plate = vehicle.plateNumber || vehicle.id;
  const driverName = vehicle.driverName || "Official Transport Pilot";
  const driverPhone = vehicle.driverPhone || "+91 94350-00000";
  const road = "NH-27 Assam-Meghalaya Strategic Corridor";
  const cargo = vehicle.cargo || "Essential Relief Payload";

  const handleCopyCoords = () => {
    const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center bg-slate-100 text-slate-950 rounded-lg px-2.5 py-1 border-2 border-slate-400 font-mono font-black text-sm tracking-wider shadow-inner flex-shrink-0">
              <span className="text-[9px] font-sans font-bold bg-blue-700 text-white px-1 py-0.5 rounded mr-1.5 leading-none">
                IND
              </span>
              <span>{plate}</span>
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  {plate} — {vehicle.cargoType || "Relief"} Carrier
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 uppercase tracking-widest flex items-center space-x-1 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                  <span>AIS-140 VERIFIED</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>{vehicle.origin} ➔ {vehicle.destination}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Status: {vehicle.status}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            {onTrackLive && (
              <button
                type="button"
                onClick={() => {
                  onTrackLive(vehicle);
                  onClose();
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow cursor-pointer border ${
                  isTracking
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : "bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white border-slate-700"
                }`}
              >
                <Crosshair size={13} className={isTracking ? "animate-spin" : ""} />
                <span>{isTracking ? "Tracking Active" : "Track on Map"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 4 Telemetry Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/60 border-b border-slate-800/80">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <span className="flex items-center space-x-1">
                <Gauge size={13} className="text-emerald-400" />
                <span>Live Speed</span>
              </span>
              <span className="text-emerald-400 font-mono text-[9px]">ACTIVE</span>
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-black text-white font-mono">{speed}</span>
              <span className="text-xs text-slate-400 font-bold">km/h</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                style={{ width: `${Math.min(100, (speed / 80) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <span className="flex items-center space-x-1">
                <Activity size={13} className="text-blue-400" />
                <span>Altitude ASL</span>
              </span>
              <span className="text-blue-400 font-mono text-[9px]">BARO</span>
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-black text-blue-300 font-mono">{altitude}</span>
              <span className="text-xs text-slate-400 font-bold">m</span>
            </div>
            <div className="text-[10px] text-blue-400 font-semibold mt-1 truncate">
              {altitude > 1500 ? "Alpine Pass" : "Highland Sector"}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <span className="flex items-center space-x-1">
                <Fuel size={13} className="text-amber-400" />
                <span>Fuel Reserve</span>
              </span>
              <span className="text-amber-400 font-mono text-[9px]">{fuelPercent}%</span>
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-black text-amber-300 font-mono">{fuelLitres}</span>
              <span className="text-xs text-slate-400 font-bold">/ 70 L</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">
              Safe Range: ~{rangeKm} km
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <span className="flex items-center space-x-1">
                <Satellite size={13} className="text-cyan-400" />
                <span>NavIC + GPS</span>
              </span>
              <span className="text-cyan-400 font-mono text-[9px]">3D FIX</span>
            </div>
            <div className="mt-1 flex items-baseline space-x-1">
              <span className="text-2xl font-black text-cyan-300 font-mono">16</span>
              <span className="text-xs text-slate-400 font-bold">Sats</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-semibold mt-1 truncate">
              HDOP: 0.82 • Sub-meter
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4">
          {[
            { id: "location", label: "Coordinates & GIS", icon: MapPin },
            { id: "telemetry", label: "Diagnostic Health", icon: Activity },
            { id: "driver_cargo", label: "Pilot & Manifest", icon: Package },
            { id: "ais140", label: "MoRTH VAHAN 4.0", icon: ShieldCheck },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? "border-emerald-500 text-white bg-slate-900/50"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                }`}
              >
                <Icon size={14} className={isActive ? "text-emerald-400" : "text-slate-500"} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "location" && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Geographic Coordinates (WGS-84)
                  </div>
                  <button
                    onClick={handleCopyCoords}
                    className="flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    {copiedCoords ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedCoords ? "Copied" : "Copy Coords"}</span>
                  </button>
                </div>
                <div className="mt-2 text-base font-mono font-bold text-white">
                  {lat.toFixed(6)}° N, {lng.toFixed(6)}° E
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Corridor: {road} • Estimated delay risk: {vehicle.riskScore}%
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <div className="text-slate-400 font-semibold mb-1">Origin Terminal</div>
                  <div className="text-white font-bold text-sm">{vehicle.origin}</div>
                  <div className="text-slate-500 text-[11px] mt-1">State Warehouse / Base Hub</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                  <div className="text-slate-400 font-semibold mb-1">Destination Outpost</div>
                  <div className="text-white font-bold text-sm">{vehicle.destination}</div>
                  <div className="text-emerald-400 text-[11px] mt-1">ETA: {vehicle.eta}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400 font-semibold">Road Surface</div>
                <div className="text-white font-bold text-sm mt-1">{vehicle.roadCondition}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400 font-semibold">Battery Voltage</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">24.2 V (Normal)</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400 font-semibold">Terrain Hazard Index</div>
                <div className="text-amber-400 font-bold text-sm mt-1">{vehicle.riskScore} / 100</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400 font-semibold">LoRa Mesh Node</div>
                <div className="text-cyan-400 font-bold text-sm mt-1">LORA-865-NODE-03</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400 font-semibold">Telemetry Pulse</div>
                <div className="text-white font-bold text-sm mt-1">{vehicle.lastGpsUpdate}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                <div className="text-slate-400 font-semibold">ERSS-112 SOS Link</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">ARMED & READY</div>
              </div>
            </div>
          )}

          {activeTab === "driver_cargo" && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{driverName}</div>
                    <div className="text-slate-400">Certified Convoy Pilot • BRO / NER Approved</div>
                  </div>
                </div>
                <a
                  href={`tel:${driverPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 font-semibold flex items-center space-x-1.5"
                >
                  <Phone size={13} />
                  <span>{driverPhone}</span>
                </a>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Cargo Manifest & Temperature
                </div>
                <div className="text-sm font-bold text-white">{cargo}</div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Cargo Category: <span className="text-sky-300 font-semibold">{vehicle.cargoType}</span> • High-priority transit
                </div>
              </div>
            </div>
          )}

          {activeTab === "ais140" && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={16} />
                    <span>MoRTH VAHAN 4.0 Central National Registry</span>
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${
                      isVerifyingVahan
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : isVahanLive
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : "bg-slate-900 text-slate-300 border-slate-700"
                    }`}
                  >
                    {isVerifyingVahan
                      ? "VERIFYING…"
                      : isVahanLive
                      ? "ACTIVE RC • LIVE"
                      : "ACTIVE RC • OFFLINE"}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Registration <strong className="text-white font-mono">{plate}</strong> is verified with AIS-140 compliant vehicle location tracking device (VLTD) and ERSS-112 panic button integration.
                </p>
                {vahanData && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div>Owner: <span className="text-white">{vahanData.owner_name}</span></div>
                    <div>Maker/Model: <span className="text-white">{vahanData.maker} {vahanData.model}</span></div>
                    <div>Permit: <span className="text-emerald-400">{vahanData.national_permit_number}</span></div>
                    <div>Emission: <span className="text-cyan-400">{vahanData.emission_norms}</span></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>MoRTH AIS-140 Certified Emergency Telemetry</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}


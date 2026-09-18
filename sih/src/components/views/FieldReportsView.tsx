"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { IncidentType, IncidentSeverity } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  FileText,
  MapPin,
  Camera,
  Upload,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  Sparkles,
  Shield,
  Layers,
} from "lucide-react";

export function FieldReportsView() {
  const {
    submitFieldReport,
    fieldReports,
    isOffline,
    setIsOffline,
    pendingOfflineCount,
    syncOfflineReports,
  } = useApp();

  // Form State
  const [incidentType, setIncidentType] = useState<IncidentType>("Landslide");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IncidentSeverity>("High");
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);
  const [photoName, setPhotoName] = useState<string>("");

  // Simulated status
  const [isAcquiringGps, setIsAcquiringGps] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submittedOffline, setSubmittedOffline] = useState<boolean>(false);

  // Simulated GPS Acquisition
  const handleUseCurrentLocation = () => {
    setIsAcquiringGps(true);
    setTimeout(() => {
      setIsAcquiringGps(false);
      // Simulated NER mountain pass GPS coords (e.g. Sela or West Siang corridor)
      setCoordinates([27.352, 92.245]);
      setLocation("West Kameng / Sela Pass Corridor (KM 32.4)");
    }, 600);
  };

  // Simulated Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoName(e.target.files[0].name);
    } else {
      setPhotoName("landslide_field_photo_01.jpg");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setLocation("West Kameng Sector, KM 32.4");
    }

    const result = submitFieldReport({
      incidentType,
      location: location.trim() || "West Kameng Sector, KM 32.4",
      coordinates: coordinates || [27.352, 92.245],
      description: description.trim() || "Observed slope scree roll and mud blockage across outer lane.",
      severity,
      photoName: photoName || "field_telemetry_snap.jpg",
    });

    setSubmittedId(result.id);
    setSubmittedOffline(result.offline);

    // Reset fields
    setLocation("");
    setDescription("");
    setPhotoName("");
  };

  const incidentTypes: IncidentType[] = [
    "Landslide",
    "Flood",
    "Heavy Rain",
    "Road Damage",
    "Bridge Failure",
    "Traffic",
    "Weather",
  ];

  const severities: IncidentSeverity[] = ["Low", "Medium", "High", "Critical"];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 p-3 sm:p-5 overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
              MOBILE-FIRST FIELD INCIDENT REPORTING
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Offline-Capable Hazard Logging for Border Roads (BRO), Drivers, and Regional Field Officers
          </p>
        </div>

        {/* Offline Status & Sync Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isOffline
                ? "bg-amber-950/80 border-amber-600 text-amber-300"
                : "bg-slate-900 border-slate-700 text-slate-300"
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span>📡 OFFLINE SIMULATION ACTIVE</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>🌐 ONLINE (CONNECTED)</span>
              </>
            )}
          </button>

          {pendingOfflineCount > 0 && (
            <button
              onClick={syncOfflineReports}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>SYNC ({pendingOfflineCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <div>
              <strong>Offline Mode Active:</strong> Incident reports will be stored securely in local device storage and automatically transmitted when connectivity is restored.
            </div>
          </div>
          <span className="font-mono font-bold text-amber-400">
            Pending Sync: {pendingOfflineCount}
          </span>
        </div>
      )}

      {/* Main Container: Form + Recent Field Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Report Incident Form */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>REPORT INCIDENT</span>
            </h2>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Form Protocol: v2.4
            </span>
          </div>

          {/* Success Banner if just submitted */}
          {submittedId && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-300 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ Incident Report Submitted</span>
              </div>
              <div className="text-slate-300">
                Report ID: <span className="font-mono font-bold text-emerald-400">{submittedId}</span>
              </div>
              {submittedOffline ? (
                <div className="text-amber-400 text-[11px]">
                  * Report saved locally. Will transmit upon network reconnection.
                </div>
              ) : (
                <div className="text-emerald-400 text-[11px]">
                  * Transmitted to Regional Command Center.
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Incident Type */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Incident Type
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-sky-500"
              >
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Location with Simulated GPS */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  Location / Highway Kilometer
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isAcquiringGps}
                  className="text-sky-400 hover:text-sky-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isAcquiringGps ? "Acquiring GPS..." : "📍 Use Current Location"}</span>
                </button>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. West Kameng / Sela Pass Corridor KM 32"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              {coordinates && (
                <div className="mt-1 text-[10px] text-emerald-400 font-mono">
                  GPS Coords: [{coordinates[0]}, {coordinates[1]}] (Accuracy ±3.2m)
                </div>
              )}
            </div>

            {/* Photo Upload Simulation */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Photo Evidence (Simulated)
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 border border-dashed border-slate-700 hover:border-sky-500 rounded-lg cursor-pointer text-slate-400 hover:text-white transition-colors">
                  <Camera className="w-4 h-4 text-sky-400" />
                  <span>{photoName || "[ Upload Photo / Capture ]"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {!photoName && (
                  <button
                    type="button"
                    onClick={() => setPhotoName("field_mudslide_sample_01.jpg")}
                    className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold"
                  >
                    Sample Photo
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Situation Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe road blockage extent, debris height, stranded vehicles, or structural fissure..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Severity Radio Buttons (Low, Medium, High, Critical) */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[11px]">
                Severity Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {severities.map((sev) => {
                  const isSelected = severity === sev;
                  const colorClass =
                    sev === "Critical"
                      ? isSelected
                        ? "bg-red-600 text-white border-red-500"
                        : "bg-red-950/30 text-red-400 border-red-900/60"
                      : sev === "High"
                      ? isSelected
                        ? "bg-orange-600 text-white border-orange-500"
                        : "bg-orange-950/30 text-orange-400 border-orange-900/60"
                      : sev === "Medium"
                      ? isSelected
                        ? "bg-amber-600 text-white border-amber-500"
                        : "bg-amber-950/30 text-amber-400 border-amber-900/60"
                      : isSelected
                      ? "bg-sky-600 text-white border-sky-500"
                      : "bg-sky-950/30 text-sky-400 border-sky-900/60";

                  return (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`py-2 rounded-lg border text-center font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${colorClass}`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-900/40 cursor-pointer"
            >
              SUBMIT REPORT
            </button>
          </form>
        </div>

        {/* Local Storage & Field Reports History */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Local Submissions Queue ({fieldReports.length})
            </h2>
            <span className="text-[11px] text-slate-500">
              Synced with browser storage
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[580px]">
            {fieldReports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400">{report.id}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={report.severity} size="sm" />
                    {report.synced ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> SYNCED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Clock className="w-3 h-3" /> PENDING SYNC
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{report.incidentType}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{report.location}</span>
                </div>

                <p className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Logged: {report.timestamp}</span>
                  {report.photoName && (
                    <span className="font-mono text-sky-400">📷 {report.photoName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

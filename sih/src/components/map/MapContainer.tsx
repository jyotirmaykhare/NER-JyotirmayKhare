"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Road, Vehicle, Incident } from "@/types";

interface MapContainerProps {
  height?: string;
  isEmergencyMode?: boolean;
  onSelectRoad?: (road: Road) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onSelectIncident?: (incident: Incident) => void;
}

const DynamicLeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-3" />
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
        Initializing NER Regional GIS Telemetry...
      </div>
      <div className="text-[11px] text-slate-500 mt-1">
        Loading 8 North Eastern States • Assam • Arunachal • Meghalaya • Manipur
      </div>
    </div>
  ),
});

export default function MapContainer(props: MapContainerProps) {
  return <DynamicLeafletMap {...props} />;
}

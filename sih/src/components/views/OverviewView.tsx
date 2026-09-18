"use client";

import { AlertTriangle, ArrowUpRight, CheckCircle2, MapPin, Package, Route, Truck } from "lucide-react";
import MapContainer from "@/components/map/MapContainer";
import { useApp } from "@/context/AppContext";

const severityStyle = (severity: string) => severity === "Critical" ? "text-red-700 bg-red-50 border-red-200" : severity === "High" ? "text-amber-800 bg-amber-50 border-amber-200" : "text-blue-700 bg-blue-50 border-blue-200";

export function OverviewView() {
  const { roads, vehicles, shipments, incidents, focusOnLocation, setActiveTab } = useApp();
  const openRoads = roads.filter((road) => road.status === "accessible").length;
  const movingVehicles = vehicles.filter((vehicle) => vehicle.status === "moving").length;
  const delayedShipments = shipments.filter((shipment) => shipment.status === "delayed").length;
  const activeIncidents = incidents.filter((incident) => !incident.resolved);

  return (
    <div className="ops-overview flex-1 overflow-y-auto bg-slate-950">
      <section className="ops-intro">
        <div>
          <p className="ops-eyebrow">Today’s operations</p>
          <h1>Everything you need to keep moving.</h1>
          <p>See what is running normally, what needs attention, and where to act next.</p>
        </div>
        <div className="ops-intro-actions">
          <button onClick={() => setActiveTab("field-reports")} className="ops-button ops-button-primary">Create live report</button>
          <button onClick={() => setActiveTab("map")} className="ops-button ops-button-secondary">Open live map <ArrowUpRight className="h-4 w-4" /></button>
        </div>
      </section>

      <section className="ops-status-grid" aria-label="Operational summary">
        <button onClick={() => setActiveTab("accessibility")} className="ops-status-card">
          <span className="ops-status-icon text-emerald-700"><Route className="h-5 w-5" /></span>
          <span><strong>{openRoads} routes open</strong><small>of {roads.length} monitored corridors</small></span>
          <span className="ops-status-action">View routes</span>
        </button>
        <button onClick={() => setActiveTab("vehicles")} className="ops-status-card">
          <span className="ops-status-icon text-blue-700"><Truck className="h-5 w-5" /></span>
          <span><strong>{movingVehicles} vehicles moving</strong><small>{vehicles.length - movingVehicles} need a status check</small></span>
          <span className="ops-status-action">View vehicles</span>
        </button>
        <button onClick={() => setActiveTab("shipments")} className="ops-status-card">
          <span className="ops-status-icon text-violet-700"><Package className="h-5 w-5" /></span>
          <span><strong>{shipments.length} active shipments</strong><small>{delayedShipments} currently delayed</small></span>
          <span className="ops-status-action">View shipments</span>
        </button>
        <button onClick={() => setActiveTab("alerts")} className="ops-status-card">
          <span className="ops-status-icon text-amber-700"><AlertTriangle className="h-5 w-5" /></span>
          <span><strong>{activeIncidents.length} open incidents</strong><small>Prioritised for your review</small></span>
          <span className="ops-status-action">Review alerts</span>
        </button>
      </section>

      <section className="ops-work-grid">
        <div className="ops-map-panel">
          <div className="ops-panel-heading"><div><p className="ops-eyebrow">Live view</p><h2>Regional movement map</h2><p>Choose a marker to see details. The map will only move when you ask it to.</p></div><button onClick={() => setActiveTab("map")} className="ops-text-button">Full map <ArrowUpRight className="h-4 w-4" /></button></div>
          <MapContainer height="h-[510px]" />
        </div>

        <aside className="ops-alert-panel">
          <div className="ops-panel-heading"><div><p className="ops-eyebrow">Needs attention</p><h2>Open incidents</h2></div><button onClick={() => setActiveTab("alerts")} className="ops-text-button">See all</button></div>
          <div className="ops-incident-list">
            {activeIncidents.slice(0, 5).map((incident) => <button key={incident.id} onClick={() => focusOnLocation(incident.coordinates[0], incident.coordinates[1], 9, incident.location)} className="ops-incident-row">
              <span className={`ops-severity ${severityStyle(incident.severity)}`}>{incident.severity}</span>
              <span className="min-w-0"><strong>{incident.type}</strong><small>{incident.location}</small><small>{incident.affectedRoutes[0] || "Route review needed"} · {incident.timeDetected}</small></span>
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
            </button>)}
            {activeIncidents.length === 0 && <div className="ops-empty"><CheckCircle2 className="h-5 w-5" /> No unresolved incidents right now.</div>}
          </div>
          <div className="ops-alert-footer"><AlertTriangle className="h-4 w-4 text-amber-700" /><span>New issues appear here. Create a live report to add one.</span></div>
        </aside>
      </section>
    </div>
  );
}

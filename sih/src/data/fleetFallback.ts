import { MOCK_VEHICLES } from "@/data/vehicles";
import type { FleetRegistryItem, FleetResponse } from "@/types/api";

/**
 * Fleet shape adapters.
 *
 * The FastAPI engine models a vehicle as a fuel/terrain entity (`license_plate`,
 * `assigned_driver`, flat `lat`/`lng`), while the UI contract is the AIS-140
 * registry shape. `normalizeEngineFleet` bridges the two so the API layer can
 * serve engine telemetry without leaking the difference to the UI.
 */

type UnknownRecord = Record<string, unknown>;

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function bool(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

export function normalizeEngineVehicle(raw: UnknownRecord): FleetRegistryItem | null {
  const lat = num(raw.lat);
  const lng = num(raw.lng);

  if (lat === undefined || lng === undefined) return null;

  return {
    vehicle_number: str(raw.vehicle_number) ?? str(raw.license_plate) ?? "UNREGISTERED",
    driver_name: str(raw.driver_name) ?? str(raw.assigned_driver) ?? null,
    driver_phone: str(raw.driver_phone) ?? null,
    vehicle_type: str(raw.vehicle_type) ?? null,
    fuel_type: str(raw.fuel_type) ?? null,
    cargo_manifest: str(raw.cargo_manifest) ?? null,
    current_road: str(raw.current_road) ?? null,
    destination: str(raw.destination) ?? null,
    state: str(raw.state) ?? null,
    lat,
    lng,
    speed_kmh: num(raw.speed_kmh) ?? 0,
    altitude_m: num(raw.altitude_m) ?? null,
    fuel_percentage: num(raw.fuel_percentage) ?? 0,
    status: str(raw.status) ?? undefined,
    is_in_transit: bool(raw.is_in_transit) ?? true,
    is_online: bool(raw.is_online) ?? true,
    last_ping: str(raw.last_ping) ?? new Date().toISOString(),
  };
}

/**
 * Accepts either the engine's bare array or an already-wrapped fleet payload and
 * returns a normalised `FleetResponse`.
 */
export function normalizeEngineFleet(payload: unknown): FleetResponse | null {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as UnknownRecord | null)?.vehicles)
    ? ((payload as UnknownRecord).vehicles as unknown[])
    : null;

  if (!list) return null;

  const vehicles = list
    .filter((item): item is UnknownRecord => typeof item === "object" && item !== null)
    .map(normalizeEngineVehicle)
    .filter((item): item is FleetRegistryItem => item !== null);

  if (vehicles.length === 0) return null;

  return {
    success: true,
    total: vehicles.length,
    vehicles,
    telemetry_standard: "MoRTH AIS-140 / ERSS-112 Compliant",
    timestamp: new Date().toISOString(),
  };
}

/** Offline AIS-140 fleet registry derived from the curated convoy dataset. */
export function buildOfflineFleet(): FleetResponse {
  const vehicles: FleetRegistryItem[] = MOCK_VEHICLES.map((vehicle) => ({
    vehicle_number: vehicle.plateNumber,
    driver_name: vehicle.driverName,
    driver_phone: vehicle.driverPhone,
    vehicle_type: vehicle.cargoType,
    cargo_manifest: vehicle.cargo,
    current_road: vehicle.roadCondition,
    destination: vehicle.destination,
    speed_kmh: vehicle.speedKmH,
    lat: vehicle.coordinates[0],
    lng: vehicle.coordinates[1],
    status: vehicle.status,
    is_in_transit: vehicle.status === "moving" || vehicle.status === "delayed",
    is_online: true,
    last_ping: vehicle.lastGpsUpdate,
  }));

  return {
    success: true,
    total: vehicles.length,
    vehicles,
    telemetry_standard: "MoRTH AIS-140 / ERSS-112 Compliant (offline dataset)",
    timestamp: new Date().toISOString(),
  };
}
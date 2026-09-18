import { Vehicle } from "@/types";

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "veh-1",
    plateNumber: "AS-01-4582",
    cargo: "Critical Antibiotics & Pediatric Vaccines",
    cargoType: "Medical",
    origin: "Guwahati Central Depot",
    destination: "Tawang Civil Hospital",
    status: "moving",
    speedKmH: 42,
    distanceRemainingKm: 68,
    eta: "2h 10m",
    roadCondition: "Wet pavement, fog near Sela pass",
    riskScore: 38,
    lastGpsUpdate: "14 seconds ago",
    driverName: "Tsering Dorjee",
    driverPhone: "+91 94350-12894",
    coordinates: [27.3100, 92.2800],
    currentWaypointIndex: 1,
    routeCoordinates: [
      [26.1445, 91.7362], // Guwahati
      [26.6338, 92.7926], // Tezpur
      [27.2645, 92.4200], // Bomdila
      [27.3500, 92.2400], // Dirang
      [27.5000, 92.0900], // Sela Tunnel
      [27.5861, 91.8594], // Tawang
    ],
  },
  {
    id: "veh-2",
    plateNumber: "MN-04-1298",
    cargo: "Essential Food Grains (FCI Relief Rice)",
    cargoType: "Food",
    origin: "Imphal West Food Godown",
    destination: "Ukhrul Distribution Center",
    status: "delayed",
    speedKmH: 0,
    distanceRemainingKm: 44,
    eta: "4h 30m",
    roadCondition: "Single-lane clearance due to boulder fall",
    riskScore: 68,
    lastGpsUpdate: "2 mins ago",
    driverName: "L. Somorendro Singh",
    driverPhone: "+91 98621-55420",
    coordinates: [24.9600, 94.2200],
    currentWaypointIndex: 2,
    routeCoordinates: [
      [24.8170, 93.9368], // Imphal
      [24.9000, 94.1000], // Yaingangpokpi
      [24.9600, 94.2200], // Litan
      [25.1167, 94.3667], // Ukhrul
    ],
  },
  {
    id: "veh-3",
    plateNumber: "AR-02-9904",
    cargo: "Aviation Turbine Fuel & Diesel Barrels",
    cargoType: "Fuel",
    origin: "Numaligarh Refinery (Assam)",
    destination: "Pasighat Advanced Landing Ground",
    status: "moving",
    speedKmH: 54,
    distanceRemainingKm: 112,
    eta: "2h 45m",
    roadCondition: "Steady rain, road open with cautionary speed",
    riskScore: 29,
    lastGpsUpdate: "30 seconds ago",
    driverName: "Bipul Kalita",
    driverPhone: "+91 91012-44319",
    coordinates: [27.5500, 94.9000],
    currentWaypointIndex: 2,
    routeCoordinates: [
      [26.5900, 93.7500], // Numaligarh
      [27.2300, 94.1000], // North Lakhimpur
      [27.4800, 94.5700], // Dhemaji
      [28.0667, 95.3333], // Pasighat
    ],
  },
  {
    id: "veh-4",
    plateNumber: "SK-01-3312",
    cargo: "Dialysis Kits & Blood Bags",
    cargoType: "Medical",
    origin: "Siliguri Medical Warehouse",
    destination: "STNM Hospital Gangtok",
    status: "rerouted",
    speedKmH: 35,
    distanceRemainingKm: 52,
    eta: "1h 55m",
    roadCondition: "Rerouted via Bagrakote-Lava due to 29th Mile Teesta slip",
    riskScore: 54,
    lastGpsUpdate: "45 seconds ago",
    driverName: "Karma Lepcha",
    driverPhone: "+91 97330-88124",
    coordinates: [27.0800, 88.6200],
    currentWaypointIndex: 1,
    routeCoordinates: [
      [26.7271, 88.3953], // Siliguri
      [26.8850, 88.4730], // Sevoke
      [27.0800, 88.6200], // Lava
      [27.2400, 88.6000], // Ranipool
      [27.3389, 88.6065], // Gangtok
    ],
  },
  {
    id: "veh-5",
    plateNumber: "AS-25-1102",
    cargo: "Pre-fabricated Water Purification Kits",
    cargoType: "Relief",
    origin: "Guwahati Disaster Response HQ",
    destination: "Silchar Relief Cell",
    status: "moving",
    speedKmH: 48,
    distanceRemainingKm: 96,
    eta: "2h 30m",
    roadCondition: "Wet surface on NH-6, clear through Jowai bypass",
    riskScore: 22,
    lastGpsUpdate: "10 seconds ago",
    driverName: "Pranab Saikia",
    driverPhone: "+91 99540-33018",
    coordinates: [25.4500, 92.2000],
    currentWaypointIndex: 2,
    routeCoordinates: [
      [26.1445, 91.7362], // Guwahati
      [25.5788, 91.8933], // Shillong
      [25.4500, 92.2000], // Jowai
      [24.8333, 92.8000], // Silchar
    ],
  }
];

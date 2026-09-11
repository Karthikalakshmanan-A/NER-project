export type MovementType = 'Freight' | 'Passenger' | 'Emergency';
export type IndiaRegion = 'All India' | 'South' | 'North' | 'West' | 'East' | 'Central' | 'Northeast';

export interface IndiaLocation {
  id: string;
  name: string;
  state: string;
  region: IndiaRegion;
  x: number; // percentage 0-100 on India SVG map
  y: number; // percentage 0-100 on India SVG map
  lat: number;
  lng: number;
  elevationMeters: number;
  terrainType: 'Plains' | 'Plateau' | 'Western Ghats' | 'Eastern Ghats' | 'Himalayas' | 'Coastal' | 'Desert' | 'NER Hills';
  majorHighways: string[];
  weather: {
    tempC: number;
    condition: string;
    rainfallMm: number;
    windKmh: number;
    humidity: number;
  };
}

export type CargoType = 
  | 'Essential Medicines & Vaccines'
  | 'Fresh Agricultural Produce'
  | 'Petroleum & LPG Fuel'
  | 'Heavy Construction Machinery'
  | 'Disaster Relief Kits'
  | 'General Manufactured Goods'
  | 'Automobile & Engineering'
  | 'E-Commerce & Express Parcels'
  | 'Passenger Transit';

export type VehicleType = 
  | 'Heavy 6-Axle Multi-Axle Truck'
  | 'Medium 4-Axle Rigid Truck'
  | 'Heavy Electric Freight Truck (EV)'
  | '4x4 Hill Cargo Pickup'
  | 'Heavy Hill-Bus'
  | 'Light Passenger Van / Tata Sumo'
  | '4WD Emergency Ambulance';

export type PriorityLevel = 'Normal' | 'High' | 'Emergency';

export type RoadStatus = 'Safe' | 'Moderate Risk' | 'High Risk' | 'Road Blocked';

export interface RoadSegment {
  id: string;
  name: string;
  highwayNumber: string;
  fromNode: string;
  toNode: string;
  status: RoadStatus;
  riskScore: number;
  condition: string;
  elevationGradient: string;
  weatherImpact: string;
  landslideRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  networkCoverage: '4G/5G' | '2G/3G' | 'Patchy' | 'Zero Signal';
  activeAlert?: string;
  lengthKm: number;
  avgTravelTimeHrs: number;
  pathCoords: [number, number][]; // Relative coordinates for SVG map
  region?: IndiaRegion;
}

export interface MapCityNode {
  id: string;
  name: string;
  state: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: 'Capital' | 'Major Hub' | 'Border Point' | 'Hill Outpost' | 'Industrial Port';
  elevationMeters: number;
  region?: IndiaRegion;
  weather: {
    tempC: number;
    condition: string;
    rainfallMm: number;
    windKmh: number;
    humidity: number;
  };
}

export interface ActiveVehicle {
  id: string;
  registrationNumber: string;
  type: 'Freight' | 'Passenger' | 'Emergency';
  vehicleModel: VehicleType;
  driverName: string;
  driverPhone: string;
  currentLocationName: string;
  x: number;
  y: number;
  heading: number; // degrees
  speedKmh: number;
  fuelLevelPercent: number;
  status: 'In Transit' | 'Delayed / High Risk' | 'Halted' | 'Delivered' | 'Emergency Dispatched';
  cargo: string;
  priority: PriorityLevel;
  destination: string;
  routeAssigned: string;
  networkStatus: 'Online (4G)' | 'Weak (2G)' | 'Offline (GPS Cached)';
  eta: string;
  aiAlert?: string;
}

export interface RouteOption {
  id: 'Route A' | 'Route B' | 'Route C';
  title: string;
  via: string;
  distanceKm: number;
  timeHours: number;
  riskPercent: number;
  fuelLevel: 'Low' | 'Medium' | 'High';
  decision: 'Avoid' | 'Best Route' | 'Alternative Route';
  safetyVerdict: string;
  terrainSummary: string;
  nationalHighways?: string[];
  fuelCostInr?: number;
  fastagTollEstimateInr?: number;
  tollPlazaCount?: number;
  ghatSectionCount?: number;
  elevationProfile?: { distancePct: number; elevationM: number; label: string }[];
  stateBorders?: string[];
  co2EmissionsKg?: number;
  factors: {
    roadQuality: string;
    landslideRisk: string;
    weatherCondition: string;
    networkAvailability: string;
    elevationMaxMeters: number;
    hairpinBends: number;
  };
}

export interface VillageAccessibility {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  overallScore: number; // 0 - 100
  roadAccessibility: number; // %
  publicTransport: number; // %
  mobileConnectivity: number; // %
  emergencyAccess: number; // %
  weatherRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  aiVerdict: string;
  nearestBus: { name: string; distanceKm: number; frequency: string };
  sharedTaxi: { standName: string; distanceKm: number; vehicleType: string };
  hospital: { name: string; distanceKm: number; type: string; contact: string };
  emergencyServices: { unit: string; distanceKm: number; responseTimeMins: number };
  fuelStation: { name: string; distanceKm: number; status: string };
  coordinates: { x: number; y: number };
}

export interface EmergencyDisasterEvent {
  id: string;
  locationName: string;
  state: string;
  disasterType: 'Flood' | 'Landslide' | 'Heavy Rain' | 'Road Block';
  severity: 'Critical' | 'Severe' | 'Moderate';
  reportedAt: string;
  affectedVillages: string[];
  blockedRoads: string[];
  availableRoads: string[];
  nearestWarehouse: { name: string; distanceKm: number; capacityTons: number };
  nearestHospital: { name: string; distanceKm: number; availableBeds: number };
  availableVehicles: string[];
  recommendedEmergencyRoute: string;
  priorityResourceNeeded: 'Medicine' | 'Food' | 'Rescue Team' | 'Fuel';
  aiRescuePlan: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  meta?: {
    routeData?: Partial<RouteOption>;
    riskScore?: number;
  };
}

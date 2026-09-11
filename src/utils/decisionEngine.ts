import { MovementType, CargoType, VehicleType, PriorityLevel, RouteOption, IndiaLocation } from '../types';
import { runPanIndiaSmartPredictionEngine, PanIndiaEngineResult } from './panIndiaPredictionEngine';

export interface DecisionEngineInput {
  fromLocation: string;
  destination: string;
  fromGeo?: { lat: number; lng: number; state?: string; district?: string };
  destGeo?: { lat: number; lng: number; state?: string; district?: string };
  movementType: MovementType;
  cargoType: CargoType;
  vehicleType: VehicleType;
  priority: PriorityLevel;
  weatherFactor?: 'Clear' | 'Moderate Rain' | 'Heavy Rain / Cloudburst' | 'Dense Fog / Low Visibility' | 'Extreme Heat';
  networkRequirement?: 'Any' | 'Strict 4G/5G' | 'Satellite Offline OK';
}

export interface DecisionEngineResult {
  originLocation?: IndiaLocation;
  destLocation?: IndiaLocation;
  overallRiskScore: number;
  riskCategory: 'Safe' | 'Moderate' | 'High Risk' | 'Critical';
  recommendedRoute: RouteOption;
  alternativeRoute: RouteOption;
  avoidRoute: RouteOption;
  allRoutes: RouteOption[];
  etaDisplay: string;
  fuelEstimateLiters: number;
  fuelCostInr?: number;
  fastagTollEstimateInr?: number;
  tollPlazaCount?: number;
  safetyRecommendation: string;
  terrainSummary?: string;
  statesTraversed?: string[];
  keyFactors: {
    title: string;
    value: string;
    impact: 'positive' | 'warning' | 'critical';
  }[];
}

export function runSmartDecisionEngine(input: DecisionEngineInput): DecisionEngineResult {
  const panIndiaResult = runPanIndiaSmartPredictionEngine({
    fromLocation: input.fromLocation,
    destination: input.destination,
    fromGeo: input.fromGeo,
    destGeo: input.destGeo,
    movementType: input.movementType,
    cargoType: input.cargoType,
    vehicleType: input.vehicleType,
    priority: input.priority,
    weatherFactor: input.weatherFactor
  });

  return {
    originLocation: panIndiaResult.originLocation,
    destLocation: panIndiaResult.destLocation,
    overallRiskScore: panIndiaResult.overallRiskScore,
    riskCategory: panIndiaResult.riskCategory,
    recommendedRoute: panIndiaResult.recommendedRoute,
    alternativeRoute: panIndiaResult.alternativeRoute,
    avoidRoute: panIndiaResult.avoidRoute,
    allRoutes: panIndiaResult.allRoutes,
    etaDisplay: panIndiaResult.etaDisplay,
    fuelEstimateLiters: panIndiaResult.fuelEstimateLiters,
    fuelCostInr: panIndiaResult.fuelCostInr,
    fastagTollEstimateInr: panIndiaResult.fastagTollEstimateInr,
    tollPlazaCount: panIndiaResult.tollPlazaCount,
    safetyRecommendation: panIndiaResult.safetyRecommendation,
    terrainSummary: panIndiaResult.terrainSummary,
    statesTraversed: panIndiaResult.statesTraversed,
    keyFactors: panIndiaResult.keyFactors
  };
}


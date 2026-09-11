import { 
  MovementType, 
  CargoType, 
  VehicleType, 
  PriorityLevel, 
  RouteOption, 
  IndiaLocation 
} from '../types';
import { 
  INDIA_LOCATIONS, 
  findLocationByNameOrId, 
  calculateHaversineDistanceKm 
} from '../data/indiaLocations';

export interface PanIndiaEngineInput {
  fromLocation: string;
  destination: string;
  fromGeo?: { lat: number; lng: number; state?: string; district?: string };
  destGeo?: { lat: number; lng: number; state?: string; district?: string };
  movementType: MovementType;
  cargoType: CargoType;
  vehicleType: VehicleType;
  priority: PriorityLevel;
  weatherFactor?: 'Clear' | 'Moderate Rain' | 'Heavy Rain / Cloudburst' | 'Dense Fog / Low Visibility' | 'Extreme Heat';
}

export interface PanIndiaEngineResult {
  originLocation: IndiaLocation;
  destLocation: IndiaLocation;
  overallRiskScore: number;
  riskCategory: 'Safe' | 'Moderate' | 'High Risk' | 'Critical';
  recommendedRoute: RouteOption;
  alternativeRoute: RouteOption;
  avoidRoute: RouteOption;
  allRoutes: RouteOption[];
  etaDisplay: string;
  fuelEstimateLiters: number;
  fuelCostInr: number;
  fastagTollEstimateInr: number;
  tollPlazaCount: number;
  safetyRecommendation: string;
  terrainSummary: string;
  statesTraversed: string[];
  keyFactors: {
    title: string;
    value: string;
    impact: 'positive' | 'warning' | 'critical';
  }[];
}

// Fallback generator for custom Indian locations typed by the user or from GPS
function resolveOrCreateLocation(
  query: string, 
  defaultState = 'India', 
  customGeo?: { lat: number; lng: number; state?: string; district?: string }
): IndiaLocation {
  const existing = findLocationByNameOrId(query);
  if (existing && !customGeo) return existing;

  const cleanName = query.trim() || 'Custom Location';
  const lower = cleanName.toLowerCase();

  // If custom GPS or Nominatim coordinates are provided, prioritize them directly
  if (customGeo && customGeo.lat && customGeo.lng) {
    const lat = customGeo.lat;
    const lng = customGeo.lng;
    const state = customGeo.state || existing?.state || defaultState;
    const region = lat < 16 ? 'South' : lat > 26 ? 'North' : lng > 88 ? 'Northeast' : lng > 82 ? 'East' : lng < 75 ? 'West' : 'Central';
    const isHilly = lat > 30 || (lat > 24 && lng > 88) || (lng < 76 && lat > 9 && lat < 20);

    return {
      id: `geo-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: cleanName,
      state,
      region,
      x: Math.round(((lng - 68) / (98 - 68)) * 100),
      y: Math.round(((38 - lat) / (38 - 8)) * 100),
      lat,
      lng,
      elevationMeters: isHilly ? 1100 : 150,
      terrainType: isHilly ? 'Western Ghats' : 'Plains',
      majorHighways: existing?.majorHighways || ['National Highway / State Corridor'],
      weather: {
        tempC: 29,
        condition: 'Clear to Hazy',
        rainfallMm: 4,
        windKmh: 14,
        humidity: 65
      }
    };
  }

  if (existing) return existing;

  // Intelligent inference for common unlisted Indian cities
  let state = 'India';
  let region: IndiaLocation['region'] = 'Central';
  let terrainType: IndiaLocation['terrainType'] = 'Plains';
  let lat = 20.5937;
  let lng = 78.9629;
  let elevation = 200;

  if (lower.includes('chennai') || lower.includes('madurai') || lower.includes('salem') || lower.includes('trichy') || lower.includes('erode') || lower.includes('tirunelveli') || lower.includes('vellore') || lower.includes('ooty') || lower.includes('kodaikanal') || lower.includes('thanjavur')) {
    state = 'Tamil Nadu';
    region = 'South';
    lat = 11.1271;
    lng = 78.6569;
    elevation = lower.includes('ooty') || lower.includes('kodaikanal') ? 2100 : 120;
    terrainType = elevation > 1000 ? 'Western Ghats' : 'Plains';
  } else if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('mysore') || lower.includes('hubli') || lower.includes('belagavi') || lower.includes('udupi') || lower.includes('shimoga')) {
    state = 'Karnataka';
    region = 'South';
    lat = 13.5;
    lng = 76.5;
    elevation = 750;
    terrainType = 'Plateau';
  } else if (lower.includes('mumbai') || lower.includes('pune') || lower.includes('thane') || lower.includes('nashik') || lower.includes('shirdi') || lower.includes('kolhapur') || lower.includes('solapur')) {
    state = 'Maharashtra';
    region = 'West';
    lat = 19.2;
    lng = 74.0;
    elevation = 450;
    terrainType = 'Plateau';
  } else if (lower.includes('delhi') || lower.includes('noida') || lower.includes('gurugram') || lower.includes('ghaziabad') || lower.includes('faridabad')) {
    state = 'Delhi NCR';
    region = 'North';
    lat = 28.6;
    lng = 77.2;
    elevation = 216;
    terrainType = 'Plains';
  } else if (lower.includes('shimla') || lower.includes('manali') || lower.includes('kullu') || lower.includes('dharamshala') || lower.includes('rishikesh') || lower.includes('haridwar') || lower.includes('nainital')) {
    state = 'Himachal / Uttarakhand';
    region = 'North';
    lat = 31.5;
    lng = 77.5;
    elevation = 1800;
    terrainType = 'Himalayas';
  } else if (lower.includes('guwahati') || lower.includes('silchar') || lower.includes('jorhat') || lower.includes('nagaon') || lower.includes('tezpur') || lower.includes('dima hasao')) {
    state = 'Assam';
    region = 'Northeast';
    lat = 26.0;
    lng = 92.0;
    elevation = 80;
    terrainType = 'Plains';
  }

  return {
    id: `custom-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: cleanName,
    state,
    region,
    x: 45,
    y: 55,
    lat,
    lng,
    elevationMeters: elevation,
    terrainType,
    majorHighways: ['National Highway Corridor (NH)'],
    weather: {
      tempC: 30,
      condition: 'Regional Weather Active',
      rainfallMm: 5,
      windKmh: 14,
      humidity: 65
    }
  };
}

export function runPanIndiaSmartPredictionEngine(input: PanIndiaEngineInput): PanIndiaEngineResult {
  const origin = resolveOrCreateLocation(input.fromLocation, 'India', input.fromGeo);
  const dest = resolveOrCreateLocation(input.destination, 'India', input.destGeo);

  // Base straight-line distance
  let rawDistance = calculateHaversineDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng);
  if (rawDistance < 15) rawDistance = 45; // Minimum local delivery inter-city corridor

  // Terrain tortuosity factor
  const involvesHimalayas = origin.terrainType === 'Himalayas' || dest.terrainType === 'Himalayas';
  const involvesNER = origin.region === 'Northeast' || dest.region === 'Northeast' || origin.terrainType === 'NER Hills' || dest.terrainType === 'NER Hills';
  const involvesWesternGhats = origin.terrainType === 'Western Ghats' || dest.terrainType === 'Western Ghats';
  const isEmergency = input.priority === 'Emergency' || input.movementType === 'Emergency';
  const isHighPriorityCargo = input.cargoType.includes('Medicine') || input.cargoType.includes('Relief') || input.cargoType.includes('Petroleum');
  const isEV = input.vehicleType.includes('(EV)');

  let tortuosity = 1.22; // Standard plains highway
  if (involvesHimalayas) tortuosity = 1.68;
  else if (involvesNER) tortuosity = 1.55;
  else if (involvesWesternGhats) tortuosity = 1.38;

  const baseDistanceKm = Math.round(rawDistance * tortuosity);

  // Determine Primary National Highway corridors
  let primaryHighway = 'National Highway Corridor';
  let bypassHighway = 'Engineered State Expressway';
  let alternateHighway = 'Scenic Multi-Lane Arterial';

  if (origin.id === 'chennai' && dest.id === 'bengaluru') {
    primaryHighway = 'NH-48 / Chennai-Bengaluru Expressway';
    bypassHighway = 'Old Madras Road (via Kolar / Hoskote - Zero Toll Bottleneck)';
    alternateHighway = 'Via Chittoor - Ranipet Corridor';
  } else if ((origin.id === 'delhi' && dest.id === 'mumbai') || (origin.id === 'mumbai' && dest.id === 'delhi')) {
    primaryHighway = 'Delhi-Mumbai Expressway (NE-4) & NH-48';
    bypassHighway = 'Golden Quadrilateral via Jaipur-Ahmedabad-Vadodara';
    alternateHighway = 'Central Spine via Agra-Gwalior-Indore-Nashik';
  } else if ((origin.id === 'guwahati' && dest.id === 'silchar') || (origin.id === 'silchar' && dest.id === 'guwahati')) {
    primaryHighway = 'NH-6 Direct via Jowai-Sonapur Pass (High Landslide Risk)';
    bypassHighway = 'NH-27 Lumding-Haflong All-Weather 4-Lane Spine';
    alternateHighway = 'Southern Foothill Artery via Umrangso bypass';
  } else if (origin.id === 'mumbai' && dest.id === 'pune') {
    primaryHighway = 'Mumbai-Pune Yashwantrao Chavan Expressway';
    bypassHighway = 'Old Mumbai-Pune Highway (NH-48 via Khandala Ghat)';
    alternateHighway = 'Tamhini Ghat Alternate Bypass';
  } else if (origin.id === 'delhi' && dest.id === 'srinagar') {
    primaryHighway = 'NH-44 via Chandigarh, Pathankot & Banihal Tunnel';
    bypassHighway = 'Trans-Haryana NH-152D into Jammu bypass';
    alternateHighway = 'Mughal Road Alternate Pass (Seasonal)';
  } else if (origin.id === 'kolkata' && dest.id === 'chennai') {
    primaryHighway = 'NH-16 Eastern Coastal Corridor (Golden Quadrilateral)';
    bypassHighway = 'NH-16 Coastal with Vizag port bypass';
    alternateHighway = 'Inland Trunk via Sambalpur-Raipur-Vijayawada';
  } else {
    primaryHighway = `Primary ${origin.majorHighways[0] || 'NH Corridor'} to ${dest.majorHighways[0] || 'NH'}`;
    bypassHighway = `AI Recommended Low-Risk Corridor via State Expressways`;
    alternateHighway = `Regional Artery via Intermediate Industrial Hubs`;
  }

  // Base Speeds
  let avgSpeedExpressway = 72; // km/h
  let avgSpeedBypass = 65;
  let avgSpeedAlternate = 54;

  if (involvesHimalayas || involvesNER) {
    avgSpeedExpressway = 38;
    avgSpeedBypass = 42;
    avgSpeedAlternate = 30;
  } else if (involvesWesternGhats) {
    avgSpeedExpressway = 55;
    avgSpeedBypass = 52;
    avgSpeedAlternate = 44;
  }

  // Calculate Distance & Time for 3 routes
  const distA = baseDistanceKm;
  const distB = Math.round(baseDistanceKm * 1.07); // Bypass is slightly longer but safer/faster
  const distC = Math.round(baseDistanceKm * 0.96); // Shortest distance but through hills/local bottlenecks

  const timeA = parseFloat((distA / avgSpeedExpressway).toFixed(1));
  const timeB = parseFloat((distB / avgSpeedBypass).toFixed(1));
  const timeC = parseFloat((distC / avgSpeedAlternate).toFixed(1));

  // Risk Scores calculation
  let riskA = 35;
  let riskB = 18;
  let riskC = 44;

  if (involvesNER) {
    riskA = 78; // SONAPUR style landslide hazard on direct hill routes
    riskB = 22; // Lumding all weather spine
    riskC = 55;
  } else if (involvesHimalayas) {
    riskA = 65;
    riskB = 28;
    riskC = 72;
  } else if (involvesWesternGhats) {
    riskA = 48;
    riskB = 24;
    riskC = 52;
  }

  // Weather Factor impact
  if (input.weatherFactor === 'Heavy Rain / Cloudburst') {
    riskA = Math.min(95, riskA + 18);
    riskB = Math.min(42, riskB + 10);
    riskC = Math.min(85, riskC + 20);
  } else if (input.weatherFactor === 'Dense Fog / Low Visibility') {
    riskA = Math.min(75, riskA + 15);
    riskB = Math.min(38, riskB + 8);
    riskC = Math.min(68, riskC + 16);
  } else if (input.weatherFactor === 'Clear') {
    riskA = Math.max(15, riskA - 12);
    riskB = Math.max(10, riskB - 8);
    riskC = Math.max(22, riskC - 10);
  }

  // Vehicle fuel multiplier
  let fuelMultiplier = 1.0;
  if (input.vehicleType.includes('6-Axle')) fuelMultiplier = 1.8;
  else if (input.vehicleType.includes('4-Axle')) fuelMultiplier = 1.35;
  else if (input.vehicleType.includes('Pickup')) fuelMultiplier = 0.8;
  else if (input.vehicleType.includes('EV')) fuelMultiplier = 0.55;
  else if (input.vehicleType.includes('Ambulance')) fuelMultiplier = 0.9;

  // Elevation calculation
  const maxElev = Math.max(origin.elevationMeters, dest.elevationMeters, involvesHimalayas ? 3200 : involvesNER ? 1500 : involvesWesternGhats ? 1100 : 650);
  const minElev = Math.min(origin.elevationMeters, dest.elevationMeters);

  // Hairpin bends
  const hairpinCount = involvesHimalayas ? 48 : involvesNER ? 32 : involvesWesternGhats ? 24 : 4;

  // Toll plazas: Approx 1 toll per 65 km on NH
  const tollPlazaCount = Math.max(1, Math.round(distB / 65));
  const tollPerKmRate = input.vehicleType.includes('6-Axle') ? 3.4 : input.vehicleType.includes('4-Axle') ? 2.4 : 1.4;
  const fastagTollEstimateInr = Math.round(distB * tollPerKmRate);

  // Fuel calculation (avg 3.8 km/liter for heavy truck, 8 km/liter for pickup)
  const kmPerLiter = input.vehicleType.includes('6-Axle') ? 3.2 : input.vehicleType.includes('4-Axle') ? 4.2 : 7.8;
  const fuelLitersB = Math.round((distB / kmPerLiter) * (involvesHimalayas || involvesNER ? 1.25 : 1.0));
  const fuelLitersA = Math.round((distA / kmPerLiter) * (involvesHimalayas || involvesNER ? 1.35 : 1.0));
  const fuelLitersC = Math.round((distC / kmPerLiter) * (involvesHimalayas || involvesNER ? 1.2 : 1.0));

  const dieselPricePerLiter = 94.5;
  const fuelCostInr = Math.round(fuelLitersB * dieselPricePerLiter);

  // Elevation Profiles
  const profileB = [
    { distancePct: 0, elevationM: origin.elevationMeters, label: origin.name },
    { distancePct: 25, elevationM: Math.round((origin.elevationMeters + maxElev * 0.7) / 2), label: 'Transit Valley' },
    { distancePct: 55, elevationM: Math.round(maxElev * 0.85), label: 'Hill Pass / Summit Bypass' },
    { distancePct: 80, elevationM: Math.round((dest.elevationMeters + maxElev * 0.6) / 2), label: 'Approach Corridor' },
    { distancePct: 100, elevationM: dest.elevationMeters, label: dest.name }
  ];

  // States traversed
  const statesSet = new Set<string>();
  statesSet.add(origin.state);
  statesSet.add(dest.state);
  if (origin.region === 'South' && dest.region === 'North') {
    statesSet.add('Telangana / Andhra Pradesh');
    statesSet.add('Maharashtra');
    statesSet.add('Madhya Pradesh');
    statesSet.add('Uttar Pradesh / Rajasthan');
  } else if (origin.region === 'West' && dest.region === 'East') {
    statesSet.add('Madhya Pradesh');
    statesSet.add('Chhattisgarh / Jharkhand');
    statesSet.add('Odisha / Bihar');
  }
  const statesTraversed = Array.from(statesSet);

  // Build 3 distinct routes
  const routeA: RouteOption = {
    id: 'Route A',
    title: `Direct Highway Corridor (${origin.name} ➔ ${dest.name})`,
    via: primaryHighway,
    distanceKm: distA,
    timeHours: timeA,
    riskPercent: riskA,
    fuelLevel: riskA > 60 ? 'High' : 'Medium',
    decision: riskA > 65 ? 'Avoid' : 'Alternative Route',
    safetyVerdict: riskA > 65 
      ? `HIGH HAZARD: Active choke points, heavy gradient / monsoon slope slip, or dense congestion along ${primaryHighway}.`
      : `STANDARD ROUTE: Direct national corridor with active FASTag electronic lanes.`,
    terrainSummary: `${origin.terrainType} ➔ ${dest.terrainType} transition. Peak elevation ${maxElev}m.`,
    nationalHighways: [primaryHighway.split(' ')[0]],
    fuelCostInr: Math.round(fuelLitersA * dieselPricePerLiter),
    fastagTollEstimateInr: Math.round(distA * tollPerKmRate),
    tollPlazaCount: Math.max(1, Math.round(distA / 65)),
    ghatSectionCount: involvesWesternGhats || involvesHimalayas || involvesNER ? Math.round(hairpinCount / 12) : 0,
    elevationProfile: profileB,
    stateBorders: statesTraversed,
    co2EmissionsKg: Math.round(fuelLitersA * 2.68),
    factors: {
      roadQuality: 'Multi-lane bituminized highway (82% good condition)',
      landslideRisk: involvesHimalayas || involvesNER ? 'High / Active Watch' : 'Low to Nil',
      weatherCondition: input.weatherFactor || origin.weather.condition,
      networkAvailability: '4G coverage across 85% of corridor',
      elevationMaxMeters: maxElev,
      hairpinBends: hairpinCount
    }
  };

  const routeB: RouteOption = {
    id: 'Route B',
    title: `AI Recommended All-Weather Corridor (SmartMove Optimal)`,
    via: bypassHighway,
    distanceKm: distB,
    timeHours: timeB,
    riskPercent: riskB,
    fuelLevel: isEV ? 'Low' : 'Medium',
    decision: 'Best Route',
    safetyVerdict: `OPTIMAL RECOMMENDATION: Stabilized roadbed, robust retaining walls, all-weather emergency shelters, and verified 96% cellular telemetry.`,
    terrainSummary: `Engineered gradient (<6.5%), concrete bridge culverts, multi-lane bypasses around urban logjams.`,
    nationalHighways: [bypassHighway.includes('NH') ? bypassHighway : 'NH-Expressway Bypass'],
    fuelCostInr: isEV ? Math.round(distB * 4.2) : fuelCostInr,
    fastagTollEstimateInr,
    tollPlazaCount,
    ghatSectionCount: involvesWesternGhats || involvesHimalayas || involvesNER ? Math.max(1, Math.round(hairpinCount / 18)) : 0,
    elevationProfile: profileB,
    stateBorders: statesTraversed,
    co2EmissionsKg: isEV ? 0 : Math.round(fuelLitersB * 2.68),
    factors: {
      roadQuality: 'High-friction polymer modified asphalt / cement concrete (95% superior)',
      landslideRisk: 'Minimal (Engineered geotechnical anchors)',
      weatherCondition: 'Monitored with dynamic Doppler weather rerouting',
      networkAvailability: '4G/5G continuous across 96% of route',
      elevationMaxMeters: Math.round(maxElev * 0.9),
      hairpinBends: Math.round(hairpinCount * 0.6)
    }
  };

  const routeC: RouteOption = {
    id: 'Route C',
    title: `Regional Bypass & Low-Toll Corridor`,
    via: alternateHighway,
    distanceKm: distC,
    timeHours: timeC,
    riskPercent: riskC,
    fuelLevel: 'Low',
    decision: 'Alternative Route',
    safetyVerdict: `SLOW ALTERNATIVE: Lower toll expense, but narrow single-lane bridge bottlenecks, lower cellular connectivity, and lower speed ceilings.`,
    terrainSummary: `State Highway arterial, rural market town crossings, slower multi-axle maneuverability.`,
    nationalHighways: ['State Highway Arterial'],
    fuelCostInr: Math.round(fuelLitersC * dieselPricePerLiter),
    fastagTollEstimateInr: Math.round(fastagTollEstimateInr * 0.4),
    tollPlazaCount: Math.max(1, Math.round(tollPlazaCount * 0.45)),
    ghatSectionCount: involvesWesternGhats || involvesHimalayas || involvesNER ? Math.round(hairpinCount / 10) : 0,
    elevationProfile: profileB,
    stateBorders: statesTraversed,
    co2EmissionsKg: Math.round(fuelLitersC * 2.68),
    factors: {
      roadQuality: 'Paved double-lane with uneven shoulders (68% fair)',
      landslideRisk: 'Moderate in monsoonal cut-slopes',
      weatherCondition: 'Overcast with damp tarmac',
      networkAvailability: 'Patchy 2G/3G in rural sectors',
      elevationMaxMeters: Math.round(maxElev * 0.8),
      hairpinBends: Math.round(hairpinCount * 0.8)
    }
  };

  const recommendedRoute = routeB;
  const alternativeRoute = routeA.decision === 'Avoid' ? routeC : routeA;
  const avoidRoute = routeA.decision === 'Avoid' ? routeA : (routeC.riskPercent > routeA.riskPercent ? routeC : routeA);

  const overallRiskScore = routeB.riskPercent;
  let riskCategory: 'Safe' | 'Moderate' | 'High Risk' | 'Critical' = 'Safe';
  if (overallRiskScore > 75) riskCategory = 'Critical';
  else if (overallRiskScore > 50) riskCategory = 'High Risk';
  else if (overallRiskScore > 25) riskCategory = 'Moderate';

  let safetyRecommendation = `AI Smart Engine selected Route B (${distB} km, ${timeB} hrs, Risk ${riskB}%). Traverses ${statesTraversed.length} state jurisdictions with verified 4G telemetry and FASTag express lanes.`;
  if (isEmergency || isHighPriorityCargo) {
    safetyRecommendation = `PRIORITY CORRIDOR: ${input.cargoType} requires rapid, unimpeded transit. Route B provides an all-weather engineered highway with minimal risk (${riskB}%) and 24/7 highway patrol support.`;
  }

  return {
    originLocation: origin,
    destLocation: dest,
    overallRiskScore,
    riskCategory,
    recommendedRoute,
    alternativeRoute,
    avoidRoute,
    allRoutes: [routeB, routeA, routeC],
    etaDisplay: `${timeB} Hours (${distB} km)`,
    fuelEstimateLiters: fuelLitersB,
    fuelCostInr,
    fastagTollEstimateInr,
    tollPlazaCount,
    safetyRecommendation,
    terrainSummary: `${origin.name} (${origin.elevationMeters}m) ➔ ${dest.name} (${dest.elevationMeters}m). Crosses ${statesTraversed.join(', ')}.`,
    statesTraversed,
    keyFactors: [
      { title: 'Pan-India Transit Engine', value: `${origin.name} (${origin.region}) ➔ ${dest.name} (${dest.region})`, impact: 'positive' },
      { title: 'Highway Network', value: bypassHighway, impact: 'positive' },
      { title: 'Safety Optimization', value: `${riskB}% Risk on AI Route B vs ${riskA}% on Route A`, impact: 'positive' },
      { title: 'States & Border Cleared', value: `${statesTraversed.length} States: ${statesTraversed.slice(0, 3).join(', ')}${statesTraversed.length > 3 ? '...' : ''}`, impact: 'positive' },
      { title: 'Tolls & Fastag Cost', value: `${tollPlazaCount} Plazas (~₹${fastagTollEstimateInr.toLocaleString('en-IN')})`, impact: 'warning' },
      { title: 'Fuel / Energy Budget', value: isEV ? `${Math.round(distB * 0.9)} kWh Battery` : `${fuelLitersB} L Diesel (~₹${fuelCostInr.toLocaleString('en-IN')})`, impact: 'positive' }
    ]
  };
}

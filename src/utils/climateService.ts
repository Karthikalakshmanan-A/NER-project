/**
 * Automated Climate & Live Atmospheric Intelligence Service
 * Queries real-time Doppler precipitation & WMO atmospheric models from Open-Meteo
 * with resilient offline fallback models tailored for India & mountain terrain.
 */

export interface AutomatedClimateData {
  temperature: number; // °C
  apparentTemperature: number; // °C
  humidity: number; // %
  conditionText: string;
  weatherCode: number;
  weatherFactor: 'Clear' | 'Moderate Rain' | 'Heavy Rain / Cloudburst' | 'Dense Fog / Low Visibility' | 'Extreme Heat';
  precipitationMm: number; // mm/h
  precipitationProb: number; // %
  windSpeedKmh: number; // km/h
  windDirectionDeg: number;
  cloudCoverPercent: number;
  surfacePressureHpa: number;
  visibilityKm: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  climateAlert: string;
  isLiveSensor: boolean;
  generatedAt: string;
  roadSurfaceFriction: number; // 0.25 (flooded/muddy) to 0.85 (dry asphalt)
  elevationAlert?: string;
  isDaytime?: boolean;
}

// In-memory cache to prevent duplicate requests within 3 minutes
const climateCache = new Map<string, { data: AutomatedClimateData; timestamp: number }>();
const CACHE_TTL_MS = 180000; // 3 minutes

/**
 * Maps WMO weather code to standard condition text, risk, and weather factor
 */
function parseWmoCode(
  code: number,
  tempC: number,
  rainMm: number,
  windKmh: number
): {
  conditionText: string;
  weatherFactor: 'Clear' | 'Moderate Rain' | 'Heavy Rain / Cloudburst' | 'Dense Fog / Low Visibility' | 'Extreme Heat';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  climateAlert: string;
  roadFriction: number;
} {
  // Extreme heat override (> 40°C)
  if (tempC >= 41) {
    return {
      conditionText: 'Extreme Summer Heatwave (>40°C)',
      weatherFactor: 'Extreme Heat',
      riskLevel: 'High',
      climateAlert: 'Extreme ambient temperature: Risk of highway tire blowouts & engine cooling stress.',
      roadFriction: 0.82
    };
  }

  // WMO Codes
  // 0: Clear sky
  if (code === 0) {
    return {
      conditionText: 'Clear Sky & Dry Highway',
      weatherFactor: 'Clear',
      riskLevel: 'Low',
      climateAlert: 'Optimal atmospheric visibility and dry asphalt conditions.',
      roadFriction: 0.85
    };
  }

  // 1, 2, 3: Mainly clear, partly cloudy, overcast
  if (code <= 3) {
    return {
      conditionText: code === 1 ? 'Mainly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast Sky',
      weatherFactor: 'Clear',
      riskLevel: 'Low',
      climateAlert: 'Stable driving weather. No immediate precipitation risk on expressways.',
      roadFriction: 0.82
    };
  }

  // 45, 48: Fog, depositing rime fog
  if (code === 45 || code === 48) {
    return {
      conditionText: code === 48 ? 'Freezing / Rime Hill Fog' : 'Dense Morning Mist / Smog',
      weatherFactor: 'Dense Fog / Low Visibility',
      riskLevel: 'High',
      climateAlert: 'Visibility below 100 meters. Maintain amber fog lamps and safe convoy spacing.',
      roadFriction: 0.65
    };
  }

  // 51, 53, 55: Drizzle
  if (code >= 51 && code <= 55) {
    return {
      conditionText: 'Light Atmospheric Drizzle',
      weatherFactor: 'Moderate Rain',
      riskLevel: 'Moderate',
      climateAlert: 'Damp road surface. Watch for initial asphalt oil slickness on Ghat curves.',
      roadFriction: 0.68
    };
  }

  // 61, 63: Rain slight and moderate
  if (code === 61 || code === 63) {
    return {
      conditionText: code === 61 ? 'Slight Rain Showers' : 'Moderate Monsoon Rain',
      weatherFactor: 'Moderate Rain',
      riskLevel: 'Moderate',
      climateAlert: 'Moderate rainfall active. Increased braking distance required.',
      roadFriction: 0.58
    };
  }

  // 65, 80, 81, 82: Heavy rain and violent showers
  if (code === 65 || (code >= 80 && code <= 82)) {
    return {
      conditionText: 'Heavy Downpour & Surface Runoff',
      weatherFactor: 'Heavy Rain / Cloudburst',
      riskLevel: 'High',
      climateAlert: 'Torrential downpour with localized water accumulation. Reduce convoy speed.',
      roadFriction: 0.42
    };
  }

  // 71, 73, 75, 85, 86: Snow & Sleet
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      conditionText: 'Hill Snowfall / Sleet Fall',
      weatherFactor: 'Heavy Rain / Cloudburst',
      riskLevel: 'Severe',
      climateAlert: 'Icy roadbed & sub-zero conditions. Snow chains & 4x4 engagement advised.',
      roadFriction: 0.3
    };
  }

  // 95, 96, 99: Thunderstorm with hail
  if (code >= 95 && code <= 99) {
    return {
      conditionText: code === 95 ? 'Severe Thunderstorm' : 'Violent Thunderstorm & Hail',
      weatherFactor: 'Heavy Rain / Cloudburst',
      riskLevel: 'Severe',
      climateAlert: 'IMD Red Alert: High risk of sudden mountain mudslides and flash stream swells.',
      roadFriction: 0.35
    };
  }

  // Generic fallback based on rain
  if (rainMm > 15) {
    return {
      conditionText: 'Heavy Rain Watch',
      weatherFactor: 'Heavy Rain / Cloudburst',
      riskLevel: 'High',
      climateAlert: 'High precipitation rate detected. Avoid unpaved shoulder roads.',
      roadFriction: 0.45
    };
  } else if (rainMm > 2) {
    return {
      conditionText: 'Scattered Showers',
      weatherFactor: 'Moderate Rain',
      riskLevel: 'Moderate',
      climateAlert: 'Wet tarmac with moderate visibility.',
      roadFriction: 0.62
    };
  }

  return {
    conditionText: 'Scattered Clouds & Dry Road',
    weatherFactor: 'Clear',
    riskLevel: 'Low',
    climateAlert: 'Normal highway operational conditions.',
    roadFriction: 0.8
  };
}

/**
 * Generates synthetic atmospheric model for coordinates when offline or network fails
 */
function generateOfflineClimate(
  lat: number,
  lng: number,
  locationName: string = ''
): AutomatedClimateData {
  const isHighAltitudeNortheast = lat > 23 && lat < 29 && lng > 88 && lng < 97;
  const isHimalayanNorth = lat > 30;
  const isSouthernPeninsula = lat < 16;
  const isWesternArid = lng < 75 && lat > 22 && lat < 30;

  let temp = 28;
  let humidity = 65;
  let rainMm = 0;
  let code = 1;
  let wind = 14;

  if (isHighAltitudeNortheast) {
    // Wet mountainous terrain
    temp = 21;
    humidity = 88;
    rainMm = 18;
    code = 63; // Moderate rain
    wind = 19;
  } else if (isHimalayanNorth) {
    // High mountain chill/fog
    temp = 14;
    humidity = 76;
    rainMm = 4;
    code = 45; // Fog
    wind = 22;
  } else if (isWesternArid) {
    // Hot & dry
    temp = 38;
    humidity = 35;
    rainMm = 0;
    code = 0; // Clear
    wind = 16;
  } else if (isSouthernPeninsula) {
    // Coastal warm tropical
    temp = 32;
    humidity = 78;
    rainMm = 6;
    code = 61; // Light showers
    wind = 18;
  }

  const parsed = parseWmoCode(code, temp, rainMm, wind);

  return {
    temperature: temp,
    apparentTemperature: temp + (humidity > 70 ? 3 : -1),
    humidity,
    conditionText: `${parsed.conditionText} (Terrain AI Model)`,
    weatherCode: code,
    weatherFactor: parsed.weatherFactor,
    precipitationMm: rainMm,
    precipitationProb: rainMm > 10 ? 85 : rainMm > 0 ? 55 : 15,
    windSpeedKmh: wind,
    windDirectionDeg: 195,
    cloudCoverPercent: rainMm > 10 ? 85 : 45,
    surfacePressureHpa: 1012,
    visibilityKm: code === 45 ? 1.5 : rainMm > 15 ? 4.2 : 10.0,
    riskLevel: parsed.riskLevel,
    climateAlert: parsed.climateAlert,
    isLiveSensor: false,
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    roadSurfaceFriction: parsed.roadFriction,
    elevationAlert: isHighAltitudeNortheast ? 'Ghat Elevation 1,240m: Rain saturation active' : undefined,
    isDaytime: true
  };
}

/**
 * Automatically fetches real-time climate data for given coordinates
 */
export async function fetchAutomatedClimate(
  lat: number,
  lng: number,
  locationName: string = ''
): Promise<AutomatedClimateData> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = climateCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=precipitation_probability&forecast_days=1`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo response status: ${res.status}`);
    }

    const data = await res.json();
    const current = data.current || {};
    const hourly = data.hourly || {};

    const temp = Math.round((current.temperature_2m ?? 28) * 10) / 10;
    const apparentTemp = Math.round((current.apparent_temperature ?? temp) * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m ?? 65);
    const rainMm = Math.round((current.precipitation ?? current.rain ?? 0) * 10) / 10;
    const code = current.weather_code ?? 1;
    const windSpeed = Math.round((current.wind_speed_10m ?? 12) * 10) / 10;
    const windDir = Math.round(current.wind_direction_10m ?? 180);
    const cloudCover = Math.round(current.cloud_cover ?? 50);
    const pressure = Math.round(current.surface_pressure ?? 1013);
    const isDay = current.is_day === 1;

    // Precipitation probability from current hour if available
    const precipProb = Array.isArray(hourly.precipitation_probability) && hourly.precipitation_probability.length > 0
      ? hourly.precipitation_probability[0]
      : rainMm > 10 ? 90 : rainMm > 0 ? 60 : 10;

    const parsed = parseWmoCode(code, temp, rainMm, windSpeed);

    // Approximate visibility based on rain & fog
    let visibility = 10.0;
    if (code === 45 || code === 48) visibility = 0.8;
    else if (code >= 95 || rainMm > 20) visibility = 2.5;
    else if (rainMm > 5) visibility = 5.0;

    const climateResult: AutomatedClimateData = {
      temperature: temp,
      apparentTemperature: apparentTemp,
      humidity,
      conditionText: parsed.conditionText,
      weatherCode: code,
      weatherFactor: parsed.weatherFactor,
      precipitationMm: rainMm,
      precipitationProb: precipProb,
      windSpeedKmh: windSpeed,
      windDirectionDeg: windDir,
      cloudCoverPercent: cloudCover,
      surfacePressureHpa: pressure,
      visibilityKm: visibility,
      riskLevel: parsed.riskLevel,
      climateAlert: parsed.climateAlert,
      isLiveSensor: true,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      roadSurfaceFriction: parsed.roadFriction,
      isDaytime: isDay
    };

    climateCache.set(cacheKey, { data: climateResult, timestamp: Date.now() });
    return climateResult;
  } catch (err) {
    // Graceful fallback to offline model
    const offlineResult = generateOfflineClimate(lat, lng, locationName);
    climateCache.set(cacheKey, { data: offlineResult, timestamp: Date.now() });
    return offlineResult;
  }
}

/**
 * Evaluates entire corridor atmospheric hazard across origin, midpoint, and destination
 */
export async function evaluateCorridorClimate(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  originName: string,
  destName: string
): Promise<{
  originClimate: AutomatedClimateData;
  destClimate: AutomatedClimateData;
  corridorDominantFactor: 'Clear' | 'Moderate Rain' | 'Heavy Rain / Cloudburst' | 'Dense Fog / Low Visibility' | 'Extreme Heat';
  corridorRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  corridorSummary: string;
}> {
  // Fetch in parallel
  const [originClimate, destClimate] = await Promise.all([
    fetchAutomatedClimate(originLat, originLng, originName),
    fetchAutomatedClimate(destLat, destLng, destName)
  ]);

  // Pick the highest risk between origin and destination
  const priorityOrder: Record<string, number> = {
    'Heavy Rain / Cloudburst': 4,
    'Dense Fog / Low Visibility': 3,
    'Extreme Heat': 2,
    'Moderate Rain': 1,
    'Clear': 0
  };

  const dominantFactor =
    priorityOrder[originClimate.weatherFactor] >= priorityOrder[destClimate.weatherFactor]
      ? originClimate.weatherFactor
      : destClimate.weatherFactor;

  const riskOrder: Record<string, number> = {
    Severe: 4,
    High: 3,
    Moderate: 2,
    Low: 1
  };

  const highestRisk =
    riskOrder[originClimate.riskLevel] >= riskOrder[destClimate.riskLevel]
      ? originClimate.riskLevel
      : destClimate.riskLevel;

  let summary = `Corridor Atmospheric Status: ${dominantFactor}. `;
  if (dominantFactor === 'Heavy Rain / Cloudburst') {
    summary += `High-intensity downpour alert along the corridor (${Math.max(originClimate.precipitationMm, destClimate.precipitationMm)} mm/h). Roadbed soil saturation warning active.`;
  } else if (dominantFactor === 'Dense Fog / Low Visibility') {
    summary += `Reduced visibility (< ${Math.min(originClimate.visibilityKm, destClimate.visibilityKm)} km). Caution on hill ghat turns and highway junctions.`;
  } else if (dominantFactor === 'Extreme Heat') {
    summary += `High thermal index (${Math.max(originClimate.temperature, destClimate.temperature)}°C). Ensure coolant levels and tire pressure checks.`;
  } else {
    summary += `Stable driving conditions across ${originName} to ${destName}.`;
  }

  return {
    originClimate,
    destClimate,
    corridorDominantFactor: dominantFactor,
    corridorRiskLevel: highestRisk,
    corridorSummary: summary
  };
}

/**
 * Generate simulated climate profile for testing scenarios
 */
export function generatePresetClimateScenario(
  scenario: 'cloudburst' | 'fog' | 'heatwave' | 'monsoon' | 'clear'
): AutomatedClimateData {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  switch (scenario) {
    case 'cloudburst':
      return {
        temperature: 20.4,
        apparentTemperature: 21.0,
        humidity: 97,
        conditionText: 'Torrential Cloudburst & Flash Mudflow Warning',
        weatherCode: 95,
        weatherFactor: 'Heavy Rain / Cloudburst',
        precipitationMm: 86.5,
        precipitationProb: 98,
        windSpeedKmh: 42,
        windDirectionDeg: 210,
        cloudCoverPercent: 100,
        surfacePressureHpa: 998,
        visibilityKm: 1.2,
        riskLevel: 'Severe',
        climateAlert: 'IMD Red Alert: Flash flood & slope slip alert. All heavy transport diverted to All-Weather Spine.',
        isLiveSensor: false,
        generatedAt: timeStr,
        roadSurfaceFriction: 0.32,
        elevationAlert: 'Ghat saturated: Sonapur / Meghalaya slope danger zone'
      };

    case 'fog':
      return {
        temperature: 11.2,
        apparentTemperature: 10.0,
        humidity: 94,
        conditionText: 'Dense High-Altitude Fog & Valley Smog',
        weatherCode: 45,
        weatherFactor: 'Dense Fog / Low Visibility',
        precipitationMm: 0.8,
        precipitationProb: 40,
        windSpeedKmh: 6,
        windDirectionDeg: 45,
        cloudCoverPercent: 90,
        surfacePressureHpa: 1018,
        visibilityKm: 0.2,
        riskLevel: 'High',
        climateAlert: 'Visibility under 200m. Mandatory low-beam fog lights and 30 km/h speed threshold.',
        isLiveSensor: false,
        generatedAt: timeStr,
        roadSurfaceFriction: 0.65
      };

    case 'heatwave':
      return {
        temperature: 43.8,
        apparentTemperature: 47.2,
        humidity: 24,
        conditionText: 'Severe Summer Heatwave (>43°C)',
        weatherCode: 0,
        weatherFactor: 'Extreme Heat',
        precipitationMm: 0.0,
        precipitationProb: 0,
        windSpeedKmh: 24,
        windDirectionDeg: 290,
        cloudCoverPercent: 5,
        surfacePressureHpa: 1004,
        visibilityKm: 8.0,
        riskLevel: 'High',
        climateAlert: 'Extreme roadbed thermal stress. Inspect radial truck tires for delamination risk.',
        isLiveSensor: false,
        generatedAt: timeStr,
        roadSurfaceFriction: 0.84
      };

    case 'monsoon':
      return {
        temperature: 26.5,
        apparentTemperature: 30.1,
        humidity: 89,
        conditionText: 'Active Monsoon Showers & Wet Tarmac',
        weatherCode: 63,
        weatherFactor: 'Moderate Rain',
        precipitationMm: 18.4,
        precipitationProb: 80,
        windSpeedKmh: 18,
        windDirectionDeg: 190,
        cloudCoverPercent: 88,
        surfacePressureHpa: 1009,
        visibilityKm: 4.8,
        riskLevel: 'Moderate',
        climateAlert: 'Steady monsoonal precipitation. Hydroplaning watch on expressways.',
        isLiveSensor: false,
        generatedAt: timeStr,
        roadSurfaceFriction: 0.58
      };

    case 'clear':
    default:
      return {
        temperature: 28.0,
        apparentTemperature: 29.5,
        humidity: 52,
        conditionText: 'Clear Skies & Optimal Expressway Conditions',
        weatherCode: 1,
        weatherFactor: 'Clear',
        precipitationMm: 0.0,
        precipitationProb: 5,
        windSpeedKmh: 12,
        windDirectionDeg: 160,
        cloudCoverPercent: 20,
        surfacePressureHpa: 1013,
        visibilityKm: 12.0,
        riskLevel: 'Low',
        climateAlert: 'Excellent driving visibility and dry asphalt traction.',
        isLiveSensor: false,
        generatedAt: timeStr,
        roadSurfaceFriction: 0.85
      };
  }
}

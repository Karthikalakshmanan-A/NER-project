import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CloudRain, 
  Mountain, 
  Wifi, 
  Truck, 
  Car, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Compass,
  Thermometer,
  Wind,
  Droplets,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface SectorRiskProfile {
  id: string;
  name: string;
  highway: string;
  score: number;
  rainfallMm: number;
  roadCondition: string;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy Congestion' | 'Gridlocked';
  landslideProbabilityPercent: number;
  elevationMeters: number;
  slopeDegree: number;
  vehicleRestrictions: string;
  networkCoverage: string;
  weatherStatus: string;
  activeAlert: string;
  aiRecommendation: string;
}

const SECTORS: SectorRiskProfile[] = [
  {
    id: 'sonapur-nh6',
    name: 'Sonapur Ridge & Tunnel (East Jaintia Hills)',
    highway: 'NH-6 (Meghalaya-Barak Link)',
    score: 86,
    rainfallMm: 112,
    roadCondition: 'Slurry mud, water logging, washed embankment at KM 141',
    trafficLevel: 'Gridlocked',
    landslideProbabilityPercent: 88,
    elevationMeters: 1420,
    slopeDegree: 34,
    vehicleRestrictions: 'All 6-axle & 4-axle heavy trucks prohibited by SDRF',
    networkCoverage: 'Zero Cellular Signal (Satellite radio only)',
    weatherStatus: 'Torrential downpour with gale force gusts (55 km/h)',
    activeAlert: 'High landslide probability detected in the next 6–12 hours. Alternative route recommended.',
    aiRecommendation: 'Divert all south-bound freight through Lumding-Haflong corridor. Keep emergency earthmovers on 15-minute standby.'
  },
  {
    id: 'sela-pass-nh13',
    name: 'Sela Pass Approach (West Kameng to Tawang)',
    highway: 'NH-13 (Trans-Arunachal)',
    score: 74,
    rainfallMm: 48,
    roadCondition: 'Sleet accumulation, black ice on outer curves, snow drifts',
    trafficLevel: 'Moderate',
    landslideProbabilityPercent: 71,
    elevationMeters: 4170,
    slopeDegree: 42,
    vehicleRestrictions: 'Chains required on all driven wheels; 4WD only',
    networkCoverage: 'Patchy 2G near army checkposts',
    weatherStatus: 'Sub-zero freezing drizzle with dense cloud fog',
    activeAlert: 'Blizzard warning issued for high altitude curves. Rockfall hazard high.',
    aiRecommendation: 'Movement permitted in escorted convoys led by BRO snow cutter units between 07:00 and 15:00 only.'
  },
  {
    id: 'phesama-nh29',
    name: 'Phesama Slide Zone (Dimapur to Kohima)',
    highway: 'NH-29 (Nagaland Spine)',
    score: 55,
    rainfallMm: 34,
    roadCondition: 'Puglami slide active; alternating single lane on gravel bed',
    trafficLevel: 'Heavy Congestion',
    landslideProbabilityPercent: 52,
    elevationMeters: 1380,
    slopeDegree: 28,
    vehicleRestrictions: 'Staggered timing: Uphill in morning, Downhill in afternoon',
    networkCoverage: '3G with periodic packet loss',
    weatherStatus: 'Continuous drizzle with low cloud ceiling',
    activeAlert: 'Moderate slide activity detected at KM 54. Soil moisture index 68%.',
    aiRecommendation: 'Maintain 50m vehicle headway. Commercial trucks above 30T should stage at Medziphema truck bay.'
  },
  {
    id: 'guwahati-nagaon-nh27',
    name: 'Guwahati - Nagaon Bypass Corridor',
    highway: 'NH-27 (East-West Trunk)',
    score: 18,
    rainfallMm: 8,
    roadCondition: 'Paved 4-lane expressway with clear storm drains',
    trafficLevel: 'Low',
    landslideProbabilityPercent: 6,
    elevationMeters: 62,
    slopeDegree: 3,
    vehicleRestrictions: 'All classes clear (up to 49-ton multi-axle freight)',
    networkCoverage: 'Full 5G/4G continuous coverage',
    weatherStatus: 'Light overcast, dry asphalt surface',
    activeAlert: 'Corridor operating in optimal safe status.',
    aiRecommendation: 'Standard cruising speed permitted. Best designated freight backbone for regional transport.'
  }
];

export const RiskIntelligencePage: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<SectorRiskProfile>(SECTORS[0]);

  // Determine risk category
  const getRiskCategory = (score: number) => {
    if (score <= 30) return { label: 'Safe', color: 'text-emerald-500', bg: 'bg-emerald-500', ring: 'ring-emerald-500/30', border: 'border-emerald-500' };
    if (score <= 60) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500', ring: 'ring-yellow-500/30', border: 'border-yellow-500' };
    if (score <= 80) return { label: 'High Risk', color: 'text-orange-500', bg: 'bg-orange-500', ring: 'ring-orange-500/30', border: 'border-orange-500' };
    return { label: 'Critical', color: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-500/30', border: 'border-red-500' };
  };

  const cat = getRiskCategory(selectedSector.score);

  // SVG Gauge calculations (circumference for semi-circle)
  const strokeDashoffset = 251.2 - (251.2 * selectedSector.score) / 100;

  return (
    <div id="ai-risk-intelligence-page" className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Predictive Geotechnical & Meteorological AI
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            AI Risk Intelligence Engine
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Real-time multi-factorial risk modeling synthesizing Doppler precipitation radar,
            piezometric soil moisture sensors, slope angles, elevation, and cellular blindspots.
          </p>
        </div>

        {/* Sector Selector Dropdown */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 min-w-[280px]">
          <label className="text-[11px] font-mono text-slate-400 block uppercase mb-1">
            Monitored NER Sector:
          </label>
          <select
            id="sector-risk-selector"
            value={selectedSector.id}
            onChange={(e) => {
              const found = SECTORS.find(s => s.id === e.target.value);
              if (found) setSelectedSector(found);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SECTORS.map(sec => (
              <option key={sec.id} value={sec.id}>
                {sec.name} ({sec.score}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Gauge + Real-time Alert (Top), and 7 Parameters Breakdown (Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Circular Risk Gauge & Risk Level Indicator */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Real-Time AI Hazard Score
          </span>

          {/* SVG Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <svg width="220" height="150" viewBox="0 0 200 130" className="overflow-visible">
              {/* Background Arc */}
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke="#334155"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Value Arc */}
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke={
                  selectedSector.score > 80 ? '#ef4444' :
                  selectedSector.score > 60 ? '#f97316' :
                  selectedSector.score > 30 ? '#eab308' : '#22c55e'
                }
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute top-12 flex flex-col items-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {selectedSector.score}
              </span>
              <span className="text-xs font-mono text-slate-400">/ 100</span>
              <span className={`mt-1 text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${cat.bg}/20 ${cat.color} border ${cat.border}/40`}>
                {cat.label}
              </span>
            </div>
          </div>

          {/* Risk Level Threshold Guide as requested */}
          <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-left text-xs space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px] uppercase tracking-wider mb-1">
              Regional Scale Thresholds:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>0–30: <strong>Safe</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>31–60: <strong>Moderate</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>61–80: <strong>High Risk</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>81–100: <strong>Critical</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Alert & AI Recommendation */}
        <div className="lg:col-span-8 space-y-5">
          {/* Prominent Example Alert Banner */}
          <div className={`rounded-2xl p-5 border shadow-sm ${
            selectedSector.score > 60
              ? 'bg-red-500/10 dark:bg-red-950/30 border-red-500/50 text-red-900 dark:text-red-200'
              : selectedSector.score > 30
              ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/50 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white/40 dark:bg-black/20 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-red-700 dark:text-red-400 font-mono">
                    Urgent Dispatch Alert • {selectedSector.highway}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Valid 6–12 Hours</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  "{selectedSector.activeAlert}"
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 pt-1">
                  <strong>AI Recommendation:</strong> {selectedSector.aiRecommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Current Status Highlights (Weather, Landslide, Road) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                <CloudRain className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Weather Status</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedSector.weatherStatus}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Rainfall: {selectedSector.rainfallMm} mm / 24h
              </span>
            </div>

            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Landslide Warning</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedSector.landslideProbabilityPercent}% Slip Probability
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Slope Angle: {selectedSector.slopeDegree}° gradient
              </span>
            </div>

            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Road Condition</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">
                {selectedSector.roadCondition}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                Traffic: {selectedSector.trafficLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Factor Matrix: 7 Explicit Risk Intelligence Variables */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Multi-Source Input Analytics (Simulated Sensor Feeds)
            </h3>
            <p className="text-xs text-slate-500">
              The 7 variables assessed before recommending or rejecting travel corridors:
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
            ● 84 Telemetry Nodes Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. Rainfall */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-blue-500">
                <CloudRain className="w-4 h-4" /> 1. Rainfall Rate
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{selectedSector.rainfallMm} mm</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Continuous precipitation saturates uncompacted soil, reducing shear resistance on cut slopes.
            </p>
          </div>

          {/* 2. Road Condition */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-indigo-500">
                <Layers className="w-4 h-4" /> 2. Road Condition
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">Surface Log</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {selectedSector.roadCondition}
            </p>
          </div>

          {/* 3. Traffic */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-amber-500">
                <Car className="w-4 h-4" /> 3. Traffic Status
              </span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{selectedSector.trafficLevel}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Narrow hill bottlenecks cause multi-kilometer queues during slide clearances.
            </p>
          </div>

          {/* 4. Landslide Probability */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-orange-500">
                <AlertTriangle className="w-4 h-4" /> 4. Landslide Probability
              </span>
              <span className="font-bold text-orange-500">{selectedSector.landslideProbabilityPercent}%</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Derived from Geological Survey of India (GSI) slope stability indices and real-time precipitation.
            </p>
          </div>

          {/* 5. Elevation & Grade */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-emerald-500">
                <Mountain className="w-4 h-4" /> 5. Elevation Profile
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{selectedSector.elevationMeters} m</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              High altitudes trigger engine power drop, brake fading on descent, and sudden freezing fog.
            </p>
          </div>

          {/* 6. Vehicle Type Compliance */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-cyan-500">
                <Truck className="w-4 h-4" /> 6. Vehicle Restrictions
              </span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Axle Weight</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {selectedSector.vehicleRestrictions}
            </p>
          </div>

          {/* 7. Network Availability */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 col-span-1 sm:col-span-2">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-purple-500">
                <Wifi className="w-4 h-4" /> 7. Cellular / Satellite Network
              </span>
              <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">
                {selectedSector.networkCoverage}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Crucial for emergency SOS dispatch and live tracking. Low-connectivity corridors automatically trigger offline navigation cache and radio dispatch fallbacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

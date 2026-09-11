import React, { useState } from 'react';
import { VILLAGE_ACCESSIBILITY_DATA } from '../data/mockData';
import { VillageAccessibility } from '../types';
import { 
  Users, 
  MapPin, 
  Bus, 
  Car, 
  Building2, 
  ShieldAlert, 
  Fuel, 
  Wifi, 
  CloudRain, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  Phone,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const PassengerAccessibilityPage: React.FC = () => {
  const [villages, setVillages] = useState<VillageAccessibility[]>(VILLAGE_ACCESSIBILITY_DATA);
  const [selectedVillage, setSelectedVillage] = useState<VillageAccessibility>(VILLAGE_ACCESSIBILITY_DATA[0]);

  const getScoreBadge = (score: number) => {
    if (score >= 70) return { label: 'High Accessibility', bg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (score >= 45) return { label: 'Moderate Accessibility', bg: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' };
    return { label: 'Low Accessibility Alert', bg: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' };
  };

  const badge = getScoreBadge(selectedVillage.overallScore);

  return (
    <div id="passenger-accessibility-page" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            Rural Inclusion & Social Mobility Index
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Passenger & Village Accessibility Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Empowering remote tribal villages and isolated hill hamlets in Northeast India.
            Quantifying real-world mobility gaps across roads, public buses, shared hill sumos, and telecom access.
          </p>
        </div>

        {/* Village Picker */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 min-w-[260px]">
          <label className="text-[11px] font-mono text-slate-400 block uppercase mb-1">
            Select Village / Hamlet:
          </label>
          <select
            id="village-selector"
            value={selectedVillage.id}
            onChange={(e) => {
              const v = villages.find(x => x.id === e.target.value);
              if (v) setSelectedVillage(v);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.district}, {v.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Village Accessibility Card (Matching prompt example: Village X) */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {selectedVillage.name}
              </h3>
              <span className={`text-xs px-3 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              District: {selectedVillage.district}, {selectedVillage.state} • Population: {selectedVillage.population.toLocaleString()} residents
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">Overall Accessibility</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {selectedVillage.overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
              </span>
            </div>
          </div>
        </div>

        {/* 5 Core Pillars Breakdown matching prompt:
            - Road Accessibility: 60%
            - Public Transport: 30%
            - Mobile Connectivity: 20%
            - Emergency Access: 40%
            - Weather Risk: High
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Road Accessibility */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Road Accessibility
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {selectedVillage.roadAccessibility}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedVillage.roadAccessibility}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Paved vs unpaved gravel tracks</span>
          </div>

          {/* Public Transport */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Public Transport
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {selectedVillage.publicTransport}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedVillage.publicTransport}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Bus & Sumo scheduled runs</span>
          </div>

          {/* Mobile Connectivity */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Mobile Connectivity
              </span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                {selectedVillage.mobileConnectivity}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedVillage.mobileConnectivity}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Cellular tower reach & signal</span>
          </div>

          {/* Emergency Access */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Emergency Access
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {selectedVillage.emergencyAccess}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedVillage.emergencyAccess}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Ambulance & relief response time</span>
          </div>

          {/* Weather Risk */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Weather Risk
              </span>
              <span className={`text-xs font-bold ${
                selectedVillage.weatherRisk === 'High' || selectedVillage.weatherRisk === 'Critical'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {selectedVillage.weatherRisk}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  selectedVillage.weatherRisk === 'High' || selectedVillage.weatherRisk === 'Critical'
                    ? 'bg-red-500 w-4/5'
                    : 'bg-amber-500 w-1/2'
                }`}
              />
            </div>
            <span className="text-[11px] text-slate-400 block">Monsoon runoff vulnerability</span>
          </div>
        </div>

        {/* AI Result Box matching prompt example:
            "Village X is currently experiencing low accessibility conditions."
        */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block font-mono">
              AI Accessibility Intelligence Synthesis:
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
              "{selectedVillage.aiVerdict}"
            </p>
          </div>
        </div>

        {/* List of Essential Amenities matching prompt:
            - Nearest Bus
            - Shared Taxi
            - Hospital
            - Emergency Services
            - Fuel Station
        */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Critical Connectivity & Life-Support Lifelines
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Nearest Bus */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <Bus className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Nearest Bus Terminal</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedVillage.nearestBus.name}</p>
                <span className="text-[11px] text-slate-500 block">
                  {selectedVillage.nearestBus.distanceKm} km away • Frequency: {selectedVillage.nearestBus.frequency}
                </span>
              </div>
            </div>

            {/* Shared Taxi */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Shared Hill Taxi (Sumo)</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedVillage.sharedTaxi.standName}</p>
                <span className="text-[11px] text-slate-500 block">
                  {selectedVillage.sharedTaxi.distanceKm} km away • Type: {selectedVillage.sharedTaxi.vehicleType}
                </span>
              </div>
            </div>

            {/* Hospital */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Nearest Hospital / CHC</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedVillage.hospital.name}</p>
                <span className="text-[11px] text-slate-500 block">
                  {selectedVillage.hospital.distanceKm} km away • {selectedVillage.hospital.type}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3" /> {selectedVillage.hospital.contact}
                </span>
              </div>
            </div>

            {/* Emergency Services */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Emergency & SDRF Unit</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedVillage.emergencyServices.unit}</p>
                <span className="text-[11px] text-slate-500 block">
                  {selectedVillage.emergencyServices.distanceKm} km away • Response ETA: ~{selectedVillage.emergencyServices.responseTimeMins} mins
                </span>
              </div>
            </div>

            {/* Fuel Station */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                <Fuel className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Nearest Retail Fuel Station</span>
                <p className="font-semibold text-slate-900 dark:text-white">{selectedVillage.fuelStation.name}</p>
                <span className="text-[11px] text-slate-500 block">
                  {selectedVillage.fuelStation.distanceKm} km away • {selectedVillage.fuelStation.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

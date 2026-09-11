import React, { useState } from 'react';
import { EMERGENCY_EVENTS } from '../data/mockData';
import { EmergencyDisasterEvent } from '../types';
import { 
  ShieldAlert, 
  Flame, 
  CloudRain, 
  AlertTriangle, 
  Navigation, 
  Building2, 
  Truck, 
  Ambulance, 
  Package, 
  Send, 
  CheckCircle2, 
  Radio, 
  Crosshair,
  Layers,
  Sparkles
} from 'lucide-react';

export const EmergencyResponsePage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('Sonapur Tunnel, NH-6 (East Jaintia Hills)');
  const [disasterType, setDisasterType] = useState<'Flood' | 'Landslide' | 'Heavy Rain' | 'Road Block'>('Landslide');
  const [requiredResource, setRequiredResource] = useState<'Medicine' | 'Food' | 'Rescue Team' | 'Fuel'>('Medicine');

  const [isDispatched, setIsDispatched] = useState(false);
  const [dispatchLog, setDispatchLog] = useState<string[]>([]);

  // Find matching event or generate dynamic view
  const currentEvent = EMERGENCY_EVENTS.find(e => e.locationName.includes(selectedLocation.split(',')[0])) || EMERGENCY_EVENTS[0];

  const handleDispatchConvoy = () => {
    setIsDispatched(true);
    setDispatchLog([
      `[T+00:00] Alert Broadcasted to SDRF & NDRF Battalions (Assam & Meghalaya)`,
      `[T+00:05] Green Highway Corridor reserved on NH-27 Nagaon-Lumding-Haflong`,
      `[T+00:10] Resource Payload Staged: ${requiredResource} allocated from Regional Logistics Hub`,
      `[T+00:15] Convoy Leader Lead Unit (SDRF-04) en route with live satellite beacon`
    ]);
  };

  return (
    <div id="emergency-response-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border border-red-900/60 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Disaster Logistics Command & Green Corridor Control
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Emergency & Disaster Response System
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Autonomous emergency logistics routing for sudden floods, hill cloudbursts, and debris slides.
            Coordinates NDRF, SDRF, Army Border Roads Organization (BRO), and State Health departments.
          </p>
        </div>

        <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-3 text-right">
          <span className="text-[11px] text-red-300 block uppercase font-mono">Disaster Level</span>
          <span className="text-lg font-bold text-red-400 flex items-center justify-end gap-1.5">
            <Radio className="w-4 h-4 animate-pulse" /> RED PRIORITY 1
          </span>
          <span className="text-xs text-slate-300 block mt-0.5">Rapid Clearance Protocol</span>
        </div>
      </div>

      {/* Strong Required Alert Panel matching prompt:
          "Emergency route optimized for fastest and safest delivery."
      */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-100 font-mono">
              AI Command Protocol Activated
            </span>
            <h3 className="text-lg md:text-xl font-black tracking-tight">
              "Emergency route optimized for fastest and safest delivery."
            </h3>
            <p className="text-xs text-red-100 mt-0.5">
              Terrain avoidance engine active. Blocked gorges bypassed using reinforced military hill cut corridors.
            </p>
          </div>
        </div>

        <button
          onClick={handleDispatchConvoy}
          disabled={isDispatched}
          className="shrink-0 bg-white text-red-700 hover:bg-red-50 font-bold px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-80 cursor-pointer"
        >
          {isDispatched ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Convoy Deployed & Tracking</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Dispatch Emergency Convoy</span>
            </>
          )}
        </button>
      </div>

      {/* Dispatch Simulation Log if active */}
      {isDispatched && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-1.5 animate-in fade-in">
          <div className="text-emerald-400 font-bold flex items-center gap-2 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE TELEMETRY RELAY ACTIVE
          </div>
          {dispatchLog.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-500">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input Selection Controls:
          - Disaster Location
          - Disaster Type: Flood / Landslide / Heavy Rain / Road Block
          - Required Resource: Medicine / Food / Rescue Team / Fuel
      */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Disaster Incident Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Disaster Location */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Disaster Location (NER Zone)
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-red-500"
            >
              <option value="Sonapur Tunnel, NH-6 (East Jaintia Hills)">Sonapur Tunnel, NH-6 (East Jaintia Hills, Meghalaya)</option>
              <option value="Dhemaji Floodplain Breach">Dhemaji Floodplain Breach (Upper Assam)</option>
              <option value="Sela Tunnel Western Descent, NH-13">Sela Tunnel Western Descent, NH-13 (Arunachal Pradesh)</option>
              <option value="Haflong Mahur Hill Slurry">Haflong Mahur Hill Slurry (Dima Hasao)</option>
            </select>
          </div>

          {/* Disaster Type */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Disaster Type
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Landslide', 'Flood', 'Heavy Rain', 'Road Block'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDisasterType(type)}
                  className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                    disasterType === type
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Required Resource */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Required Emergency Resource
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Medicine', 'Food', 'Rescue Team', 'Fuel'] as const).map(res => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setRequiredResource(res)}
                  className={`py-1.5 px-2 rounded-lg font-semibold text-center border transition-all ${
                    requiredResource === res
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence Output Grid matching prompt:
          - Affected Villages
          - Blocked Roads
          - Available Roads
          - Nearest Warehouse
          - Nearest Hospital
          - Available Vehicles
          - Recommended Emergency Route
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Roads & Villages */}
        <div className="lg:col-span-6 space-y-4">
          {/* Affected Villages */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Affected Villages & Settlements ({currentEvent.affectedVillages.length})
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentEvent.affectedVillages.map((v, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Blocked Roads */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Blocked Roads & Impassable Sectors (Red)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {currentEvent.blockedRoads.map((rd, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 font-medium">
                  {rd}
                </li>
              ))}
            </ul>
          </div>

          {/* Available Roads */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Available All-Weather Roads & Corridors (Green)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {currentEvent.availableRoads.map((rd, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 font-medium">
                  {rd}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Logistics Support Nodes */}
        <div className="lg:col-span-6 space-y-4">
          {/* Recommended Emergency Route */}
          <div className="bg-white dark:bg-slate-850 border-2 border-blue-500 rounded-2xl p-5 shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                AI Recommended Emergency Route
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold px-2 py-0.5 rounded-full">
                Green Corridor
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {currentEvent.recommendedEmergencyRoute}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              {currentEvent.aiRescuePlan}
            </p>
          </div>

          {/* Staging Nodes: Warehouse, Hospital, Available Vehicles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Nearest Warehouse */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
                <Building2 className="w-4 h-4" /> Nearest Relief Warehouse
              </div>
              <p className="font-bold text-slate-900 dark:text-white">{currentEvent.nearestWarehouse.name}</p>
              <span className="text-slate-500 block">
                {currentEvent.nearestWarehouse.distanceKm} km • Capacity: {currentEvent.nearestWarehouse.capacityTons} Tons
              </span>
            </div>

            {/* Nearest Hospital */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                <Ambulance className="w-4 h-4" /> Nearest Hospital & Triage
              </div>
              <p className="font-bold text-slate-900 dark:text-white">{currentEvent.nearestHospital.name}</p>
              <span className="text-slate-500 block">
                {currentEvent.nearestHospital.distanceKm} km • {currentEvent.nearestHospital.availableBeds} Available Trauma Beds
              </span>
            </div>
          </div>

          {/* Available Vehicles */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-500" />
              Available Rescue Vehicles on Standby ({currentEvent.availableVehicles.length})
            </h4>
            <div className="space-y-1.5 text-xs">
              {currentEvent.availableVehicles.map((veh, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200">
                  <span>{veh}</span>
                  <span className="text-[10px] text-emerald-500 font-semibold uppercase">Ready to Roll</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

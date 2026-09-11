import React, { useState } from 'react';
import { ADMIN_STATS } from '../data/mockData';
import { InteractiveMap } from './InteractiveMap';
import { RoadSegment, ActiveVehicle } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  CloudRain, 
  Mountain, 
  Truck, 
  Bus, 
  WifiOff, 
  Activity, 
  ArrowUpRight, 
  Radio, 
  Filter, 
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateToPage?: (page: string) => void;
  isOffline?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToPage,
  isOffline = false
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<ActiveVehicle | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState('10 seconds ago');

  return (
    <div id="main-admin-dashboard" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            North Eastern Regional Logistics Control Center (MDoNER & NHIDCL Grid)
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Main Regional Command Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mt-0.5">
            Holistic situational awareness across Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, and Sikkim.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Telemetry sync: {lastRefreshed}</span>
          <button
            onClick={() => setLastRefreshed('Just now')}
            className="p-2 bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 shadow-sm"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 8 Explicit Admin Metrics Grid matching prompt:
          1. Critical Roads: 17
          2. High Risk Routes: 42
          3. Safe Routes: 126
          4. Heavy Rain Areas: 8
          5. Landslide Risk Areas: 13
          6. Active Freight Vehicles: 1,248
          7. Active Passenger Vehicles: 623
          8. Low Connectivity Areas: 31
      */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Critical Roads */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'blocked' ? 'all' : 'blocked')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            filterStatus === 'blocked'
              ? 'bg-red-500/15 border-red-500 ring-2 ring-red-500/20'
              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between text-red-600 dark:text-red-400 mb-1">
            <AlertOctagon className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Red</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.criticalRoads}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Critical Roads
          </div>
        </div>

        {/* 2. High Risk Routes */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'high-risk' ? 'all' : 'high-risk')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            filterStatus === 'high-risk'
              ? 'bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/20'
              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-orange-400'
          }`}
        >
          <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Orange</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.highRiskRoutes}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            High Risk Routes
          </div>
        </div>

        {/* 3. Safe Routes */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'safe' ? 'all' : 'safe')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            filterStatus === 'safe'
              ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Green</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.safeRoutes}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Safe Routes
          </div>
        </div>

        {/* 4. Heavy Rain Areas */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
            <CloudRain className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Radar</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.heavyRainAreas}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Heavy Rain Areas
          </div>
        </div>

        {/* 5. Landslide Risk Areas */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <Mountain className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">GSI</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.landslideRiskAreas}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Landslide Areas
          </div>
        </div>

        {/* 6. Active Freight Vehicles */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-cyan-600 dark:text-cyan-400 mb-1">
            <Truck className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Blue</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.activeFreightVehicles.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Active Freight
          </div>
        </div>

        {/* 7. Active Passenger Vehicles */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-1">
            <Bus className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Transit</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.activePassengerVehicles}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Active Passenger
          </div>
        </div>

        {/* 8. Low Connectivity Areas */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-1">
            <WifiOff className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase">Blindspots</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_STATS.lowConnectivityAreas}
          </div>
          <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight mt-0.5">
            Low Connectivity
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas (Central Highlight of Dashboard) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Regional GIS Grid (All 8 Sister States)
            </h3>
            {filterStatus !== 'all' && (
              <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                Filtered: {filterStatus}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Reset Filter
            </button>
            {onNavigateToPage && (
              <button
                onClick={() => onNavigateToPage('planner')}
                className="px-3 py-1 rounded-md font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              >
                Open Route Planner <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <InteractiveMap
          filterStatus={filterStatus}
          selectedRoadId={selectedRoad?.id}
          onSelectRoad={setSelectedRoad}
          selectedVehicleId={selectedVehicle?.id}
          onSelectVehicle={setSelectedVehicle}
          isOffline={isOffline}
        />
      </div>

      {/* Quick Action Cards & Live Dispatch Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Urgent Live Alert Feed */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              Live Terrain Incidents & Dispatch Logs
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Auto-refreshed via Satellite Beacon</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-ping" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-700 dark:text-red-300">Sonapur Tunnel Blockage (NH-6)</span>
                  <span className="text-[10px] text-slate-400">12m ago</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  1,800m³ landslide debris at KM 141. Traffic diverted via Lumding-Haflong Route B corridor.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-700 dark:text-orange-300">Tawang Sela Pass Snow-Drift Alert</span>
                  <span className="text-[10px] text-slate-400">34m ago</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  BRO snowplow teams escorting essential kerosene convoys through twin-tube tunnel.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700 dark:text-blue-300">Medicine Convoy ORD-8921 En Route</span>
                  <span className="text-[10px] text-slate-400">45m ago</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                  Vaccine truck piloted by Biren Gogoi reached Lumding bypass. Safe ETA: 18:30 IST.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* State Command Status Quick Card */}
        <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-blue-500" />
            Regional State Network Status
          </h4>

          <div className="space-y-2 text-xs">
            {[
              { state: 'Assam', status: 'Brahmaputra High Alert', badge: 'Moderate', color: 'text-amber-500 bg-amber-500/10' },
              { state: 'Meghalaya', status: 'NH-6 Blocked at Sonapur', badge: 'Critical', color: 'text-red-500 bg-red-500/10' },
              { state: 'Arunachal Pradesh', status: 'High Altitude Snow Alerts', badge: 'High Risk', color: 'text-orange-500 bg-orange-500/10' },
              { state: 'Nagaland', status: 'NH-29 Alternating Convoy', badge: 'Moderate', color: 'text-amber-500 bg-amber-500/10' },
              { state: 'Manipur', status: 'NH-2 South Corridor Clear', badge: 'Safe', color: 'text-emerald-500 bg-emerald-500/10' },
              { state: 'Mizoram', status: 'Aizawl-Silchar Damp', badge: 'Moderate', color: 'text-amber-500 bg-amber-500/10' },
              { state: 'Tripura', status: 'NH-8 Fully Operational', badge: 'Safe', color: 'text-emerald-500 bg-emerald-500/10' },
              { state: 'Sikkim', status: 'Sevoke-Rangpo Rockfall Warning', badge: 'High Risk', color: 'text-orange-500 bg-orange-500/10' }
            ].map(item => (
              <div key={item.state} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{item.state}</span>
                  <span className="text-[10px] text-slate-500">{item.status}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color}`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

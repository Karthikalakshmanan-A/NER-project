import React, { useState, useEffect } from 'react';
import { RouteOption } from '../types';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  CloudRain, 
  Fuel, 
  Wifi, 
  WifiOff, 
  PhoneCall, 
  Building2, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Compass, 
  Smartphone, 
  Maximize2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Radio,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DriverMobileViewProps {
  initialRoute?: RouteOption | null;
  isGlobalOffline?: boolean;
  onToggleGlobalOffline?: () => void;
}

export const DriverMobileView: React.FC<DriverMobileViewProps> = ({
  initialRoute,
  isGlobalOffline = false,
  onToggleGlobalOffline
}) => {
  const { t } = useLanguage();
  const [deviceFrame, setDeviceFrame] = useState(true);
  const [currentSpeed, setCurrentSpeed] = useState(48);
  const [currentLocation, setCurrentLocation] = useState('NH-27 Near Jorabat / Meghalaya Gate');
  const [destination, setDestination] = useState('Silchar Medical College');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);
  const [localOffline, setLocalOffline] = useState(isGlobalOffline);

  // Turn by turn steps
  const navigationSteps = [
    { instruction: 'In 600m, keep RIGHT at Jorabat fork towards Lumding-Haflong', distance: '600 m', icon: 'turn-right' },
    { instruction: 'AI Safe Route B: Proceed 34 km along 4-lane expressway', distance: '34 km', icon: 'straight' },
    { instruction: 'Caution: Wet pavement on hill climb. Recommended max 45 km/h', distance: '12 km', icon: 'warning' },
    { instruction: 'Enter Haflong high-grade retaining bypass', distance: '48 km', icon: 'turn-left' }
  ];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Keep local offline in sync
  useEffect(() => {
    setLocalOffline(isGlobalOffline);
  }, [isGlobalOffline]);

  const handleToggleOffline = () => {
    setLocalOffline(!localOffline);
    if (onToggleGlobalOffline) onToggleGlobalOffline();
  };

  const handleTriggerSOS = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosSuccess(true);
    }, 1200);
  };

  return (
    <div id="driver-mobile-view" className="space-y-4 flex flex-col items-center">
      {/* Top View Toggle bar */}
      <div className="w-full max-w-md flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">Driver Mobile HUD</span>
          <span className="text-slate-400">• Pilot Mode</span>
        </div>
        <button
          onClick={() => setDeviceFrame(!deviceFrame)}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          <Smartphone className="w-3.5 h-3.5" />
          {deviceFrame ? 'Expand Full Width' : 'Show Smartphone Frame'}
        </button>
      </div>

      {/* Container: either phone bezel or fluid */}
      <div className={`transition-all duration-300 w-full ${
        deviceFrame 
          ? 'max-w-md bg-slate-950 border-[10px] border-slate-900 rounded-[44px] shadow-2xl overflow-hidden ring-1 ring-slate-800' 
          : 'max-w-3xl bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden'
      }`}>
        {/* Smartphone Speaker notch if framed */}
        {deviceFrame && (
          <div className="pt-3 pb-1 flex justify-center bg-slate-950">
            <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center space-x-2">
              <div className="w-2.5 h-2.5 bg-slate-950 rounded-full" />
              <div className="w-8 h-1 bg-slate-800 rounded-full" />
            </div>
          </div>
        )}

        {/* Mobile Header Bar */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sky-400 text-xs">SMARTMOVE PILOT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="flex items-center gap-3">
            {/* Network Indicator */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              {localOffline ? (
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <WifiOff className="w-3 h-3" /> OFFLINE
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="w-3 h-3" /> 4G LTE
                </span>
              )}
            </div>

            {/* Offline toggle */}
            <button
              onClick={handleToggleOffline}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                localOffline
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {localOffline ? 'Offline Active' : 'Go Offline'}
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Navigation HUD (Prominent Green/Blue Banner) */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-black/20 rounded-xl">
                <Navigation className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-emerald-100 font-bold block">
                  Next Manoeuvre • {navigationSteps[currentStepIndex].distance}
                </span>
                <h3 className="text-base md:text-lg font-bold leading-snug mt-0.5">
                  {navigationSteps[currentStepIndex].instruction}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
              title="Toggle AI Voice Prompts"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-100">Speed: {currentSpeed} km/h (Limit: 50)</span>
            <span className="text-emerald-100 font-bold">ETA: 3 hrs 45 mins</span>
          </div>
        </div>

        {/* HUD Content Area */}
        <div className="p-4 space-y-3 bg-slate-950 text-slate-200 text-xs">
          {/* Origin & Destination Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block uppercase">Current Location (GPS Active)</span>
                <span className="font-bold text-white text-xs">{currentLocation}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-800/80 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block uppercase">Assigned Destination</span>
                <span className="font-bold text-white text-xs">{destination}</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Route Badge */}
          <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Active Corridor
              </span>
              <p className="font-bold text-white text-xs mt-0.5">
                Route B: Lumding - Haflong Bypass (350 km)
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              Safe (25% Risk)
            </span>
          </div>

          {/* Alert Triad: Road Risk + Weather Alert + Landslide Alert */}
          <div className="space-y-1.5">
            {/* Road Risk Alert */}
            <div className="p-2.5 rounded-lg bg-orange-950/30 border border-orange-800/50 flex items-start gap-2.5 text-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-bold block text-[11px] text-orange-300">Road Risk Alert:</span>
                Wet asphalt & reduced traction on Phesama hairpin curves. Keep safe headway.
              </div>
            </div>

            {/* Weather Alert */}
            <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/50 flex items-start gap-2.5 text-blue-200">
              <CloudRain className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-bold block text-[11px] text-blue-300">Weather Alert:</span>
                Heavy precipitation (45 mm/hr) expected near Barapani within 40 minutes.
              </div>
            </div>

            {/* Landslide Alert */}
            <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/50 flex items-start gap-2.5 text-red-200">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-bold block text-[11px] text-red-300">Landslide Hazard on NH-6:</span>
                Sonapur Tunnel blocked. Do NOT attempt diversion via Old NH-40. Stay on Route B.
              </div>
            </div>
          </div>

          {/* Quick Metrics: Fuel Estimation & Offline Mode Status */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Fuel className="w-3 h-3 text-cyan-400" /> Fuel Estimation
              </span>
              <span className="text-base font-bold text-white block mt-0.5">142 Liters</span>
              <span className="text-[10px] text-emerald-400">Tank: 74% (Safe margin)</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-purple-400" /> Offline Resilience
              </span>
              <span className="text-xs font-bold text-slate-200 block mt-0.5">
                {localOffline ? 'Active (GPS Cached)' : 'Online (Auto Sync)'}
              </span>
              <span className="text-[10px] text-slate-400">Tiles pre-loaded</span>
            </div>
          </div>

          {/* Lifeline Buttons: Nearest Hospital & Nearest Fuel Station */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-2.5 transition-all">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                <Building2 className="w-3 h-3" /> {t('label_nearest_hospital', 'Nearest Hospital')}
              </span>
              <p className="font-bold text-white text-xs mt-1 truncate">Khliehriat Civil Hospital</p>
              <span className="text-[10px] text-slate-400 block">34 km • SDRF Unit</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-2.5 transition-all">
              <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-bold">
                <Fuel className="w-3 h-3" /> {t('label_nearest_fuel', 'Nearest Fuel Station')}
              </span>
              <p className="font-bold text-white text-xs mt-1 truncate">IOCL Highway Outlet</p>
              <span className="text-[10px] text-slate-400 block">18 km • High Speed Diesel</span>
            </div>
          </div>

          {/* BIG RED SOS BUTTON as requested */}
          <div className="pt-2">
            <button
              onClick={handleTriggerSOS}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm tracking-wide uppercase cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>{t('btn_sos', 'EMERGENCY SOS BEACON')}</span>
            </button>
          </div>
        </div>

        {/* SOS Confirmation Modal / Drawer */}
        {sosActive && (
          <div className="p-4 bg-red-900 border-t-2 border-red-500 text-white animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 animate-ping" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">
                    {sosSuccess ? 'SOS BEACON TRANSMITTED & ACKNOWLEDGED' : 'TRANSMITTING SATELLITE SOS...'}
                  </h4>
                </div>
                <p className="text-xs text-red-100">
                  {sosSuccess 
                    ? 'State Disaster Management (SDRF) and nearest Police Highway Patrol dispatched to GPS coordinates (25.5788° N, 91.8933° E).'
                    : 'Broadcasting packet via multi-satellite constellation...'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSosActive(false);
                  setSosSuccess(false);
                }}
                className="text-xs font-bold bg-black/30 px-2.5 py-1 rounded-md"
              >
                {t('btn_dismiss', 'Dismiss')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

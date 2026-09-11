import React from 'react';
import { AutomatedClimateData, generatePresetClimateScenario } from '../utils/climateService';
import { 
  CloudRain, 
  Sun, 
  CloudFog, 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  ShieldAlert,
  Compass,
  Gauge
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AutomatedClimateCardProps {
  climate: AutomatedClimateData | null;
  isLoading?: boolean;
  onRefreshLiveClimate: () => void;
  onApplyScenario: (scenario: 'cloudburst' | 'fog' | 'heatwave' | 'monsoon' | 'clear') => void;
  locationName?: string;
  isAutoMode?: boolean;
  onToggleAutoMode?: () => void;
}

export const AutomatedClimateCard: React.FC<AutomatedClimateCardProps> = ({
  climate,
  isLoading = false,
  onRefreshLiveClimate,
  onApplyScenario,
  locationName = 'Corridor Waypoint',
  isAutoMode = true,
  onToggleAutoMode
}) => {
  const { t } = useLanguage();

  if (!climate) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-slate-400">
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-cyan-400">
            {t('climate_generating', 'Automating Live Atmospheric & Satellite Weather Telemetry...')}
          </span>
        </div>
      </div>
    );
  }

  // Pick weather icon based on factor
  const renderWeatherIcon = () => {
    switch (climate.weatherFactor) {
      case 'Heavy Rain / Cloudburst':
        return <CloudRain className="w-8 h-8 text-sky-400 animate-bounce" />;
      case 'Dense Fog / Low Visibility':
        return <CloudFog className="w-8 h-8 text-amber-300" />;
      case 'Extreme Heat':
        return <Sun className="w-8 h-8 text-orange-500 animate-spin" style={{ animationDuration: '20s' }} />;
      case 'Moderate Rain':
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'Clear':
      default:
        return <Sun className="w-8 h-8 text-amber-400" />;
    }
  };

  const getRiskBadge = () => {
    switch (climate.riskLevel) {
      case 'Severe':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-700/80 rounded-2xl p-4 shadow-lg text-white space-y-3.5 relative overflow-hidden">
      {/* Background glow based on severity */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
        climate.riskLevel === 'Severe' ? 'bg-red-600/10' :
        climate.riskLevel === 'High' ? 'bg-orange-600/10' : 'bg-cyan-600/10'
      }`} />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                {t('climate_engine_title', 'Automated Climate & Doppler Intelligence')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {climate.isLiveSensor ? 'LIVE RADAR' : 'AI MODEL'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {locationName} • Updated {climate.generatedAt}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefreshLiveClimate}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
            title="Auto-fetch latest live atmospheric conditions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Sync Live</span>
          </button>
        </div>
      </div>

      {/* Main Climate Display */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Left: Weather Icon & Temperature */}
        <div className="sm:col-span-5 flex items-center gap-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
            {renderWeatherIcon()}
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {climate.temperature}°C
              </span>
              <span className="text-xs text-slate-400">
                Feels {climate.apparentTemperature}°C
              </span>
            </div>
            <p className="text-xs font-semibold text-cyan-300 truncate max-w-[190px]">
              {climate.conditionText}
            </p>
          </div>
        </div>

        {/* Right: Key Corridor Telemetry Grid */}
        <div className="sm:col-span-7 grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-sky-400" /> Rainfall
            </span>
            <span className="font-bold text-white text-xs block mt-0.5">
              {climate.precipitationMm} mm/h
            </span>
            <span className="text-[10px] text-sky-400 font-medium">
              Prob: {climate.precipitationProb}%
            </span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Wind className="w-3 h-3 text-teal-400" /> Wind Gusts
            </span>
            <span className="font-bold text-white text-xs block mt-0.5">
              {climate.windSpeedKmh} km/h
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Dir: {climate.windDirectionDeg}°
            </span>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-indigo-400" /> Road Grip
            </span>
            <span className={`font-bold text-xs block mt-0.5 ${
              climate.roadSurfaceFriction > 0.7 ? 'text-emerald-400' :
              climate.roadSurfaceFriction > 0.5 ? 'text-amber-400' : 'text-red-400'
            }`}>
              μ = {climate.roadSurfaceFriction}
            </span>
            <span className="text-[10px] text-slate-400 font-medium truncate">
              {climate.roadSurfaceFriction > 0.7 ? 'Dry Asphalt' : climate.roadSurfaceFriction > 0.5 ? 'Wet Tarmac' : 'Slick / Muddy'}
            </span>
          </div>
        </div>
      </div>

      {/* Atmospheric Alert & Safety Advisory */}
      <div className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs ${getRiskBadge()}`}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Atmospheric Hazard Alert • {climate.riskLevel} Risk
            </span>
            <span className="text-[10px] opacity-80">
              Visibility: {climate.visibilityKm} km • Humidity: {climate.humidity}%
            </span>
          </div>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-200">
            {climate.climateAlert}
          </p>
        </div>
      </div>

      {/* Automated Scenario Simulation Buttons */}
      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Automated Simulator:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={onRefreshLiveClimate}
            className="px-2 py-1 rounded-md bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 transition-all font-semibold cursor-pointer"
          >
            ⚡ Live Auto
          </button>
          <button
            type="button"
            onClick={() => onApplyScenario('cloudburst')}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Simulate torrential cloudburst and flash flood conditions"
          >
            🌧️ Cloudburst (IMD Red)
          </button>
          <button
            type="button"
            onClick={() => onApplyScenario('fog')}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Simulate dense winter smog and mountain fog"
          >
            🌫️ Dense Fog
          </button>
          <button
            type="button"
            onClick={() => onApplyScenario('heatwave')}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Simulate 44°C extreme heatwave"
          >
            🔥 Heatwave
          </button>
          <button
            type="button"
            onClick={() => onApplyScenario('clear')}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Simulate clear skies and dry highway"
          >
            ☀️ Clear Sky
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { MovementType, CargoType, VehicleType, PriorityLevel, RouteOption, IndiaRegion, IndiaLocation } from '../types';
import { runSmartDecisionEngine, DecisionEngineResult } from '../utils/decisionEngine';
import { INDIA_LOCATIONS, PAN_INDIA_CORRIDORS } from '../data/indiaLocations';
import { RealLeafletMap } from './RealLeafletMap';
import { IndiaLocationSearchInput } from './IndiaLocationSearchInput';
import { 
  getCurrentDeviceLocation, 
  getRouteGeometry, 
  RouteGeometryResult, 
  GeoLocationResult 
} from '../utils/indiaGeoService';
import { 
  Navigation, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Fuel, 
  Clock, 
  Milestone, 
  ShieldCheck, 
  Wifi, 
  Mountain, 
  TrendingUp,
  ArrowRight,
  Send,
  Sliders,
  Check,
  MapPin,
  Compass,
  Globe2,
  Receipt,
  Leaf,
  Layers,
  Search,
  Crosshair,
  Radio,
  Play,
  Languages,
  CloudRain,
  Sun,
  CloudFog,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AutomatedClimateCard } from './AutomatedClimateCard';
import { 
  AutomatedClimateData, 
  evaluateCorridorClimate, 
  generatePresetClimateScenario 
} from '../utils/climateService';

interface SmartRoutePlannerProps {
  onRouteSelected?: (route: RouteOption) => void;
  onOpenDriverView?: (route: RouteOption) => void;
  onNavigateToMobileView?: (route: RouteOption) => void;
  isOffline?: boolean;
}

export const SmartRoutePlanner: React.FC<SmartRoutePlannerProps> = ({
  onRouteSelected,
  onOpenDriverView,
  onNavigateToMobileView,
  isOffline = false
}) => {
  const { t } = useLanguage();
  const triggerDriverView = onNavigateToMobileView || onOpenDriverView;
  const [activeRegionFilter, setActiveRegionFilter] = useState<IndiaRegion>('All India');
  const [fromLocation, setFromLocation] = useState('Chennai');
  const [destination, setDestination] = useState('Bengaluru');
  const [movementType, setMovementType] = useState<MovementType>('Freight');
  const [cargoType, setCargoType] = useState<CargoType>('Essential Medicines & Vaccines');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Medium 4-Axle Rigid Truck');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [weatherCondition, setWeatherCondition] = useState<'Clear' | 'Moderate Rain' | 'Heavy Rain / Cloudburst' | 'Dense Fog / Low Visibility' | 'Extreme Heat'>('Moderate Rain');

  const [fromSearch, setFromSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Geo and GPS Location state
  const [fromGeo, setFromGeo] = useState<GeoLocationResult | null>(null);
  const [destGeo, setDestGeo] = useState<GeoLocationResult | null>(null);
  const [userGpsLocation, setUserGpsLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<RouteGeometryResult | null>(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  // Initial calculation
  const [result, setResult] = useState<DecisionEngineResult | null>(() => {
    return runSmartDecisionEngine({
      fromLocation: 'Chennai',
      destination: 'Bengaluru',
      movementType: 'Freight',
      cargoType: 'Essential Medicines & Vaccines',
      vehicleType: 'Medium 4-Axle Rigid Truck',
      priority: 'High',
      weatherFactor: 'Moderate Rain'
    });
  });

  const [selectedRouteTab, setSelectedRouteTab] = useState<'Route B' | 'Route A' | 'Route C'>('Route B');
  const [dispatchedRoute, setDispatchedRoute] = useState<string | null>(null);

  // Automated Climate Generation state
  const [climateData, setClimateData] = useState<AutomatedClimateData | null>(null);
  const [isClimateLoading, setIsClimateLoading] = useState(false);
  const [autoClimateEnabled, setAutoClimateEnabled] = useState(true);

  // Automatically generate / fetch live climate whenever locations or GPS change
  useEffect(() => {
    if (!autoClimateEnabled) return;
    let isMounted = true;
    setIsClimateLoading(true);

    const originLat = fromGeo?.lat || result?.originLocation?.lat || 13.0827;
    const originLng = fromGeo?.lng || result?.originLocation?.lng || 80.2707;
    const destLat = destGeo?.lat || result?.destLocation?.lat || 12.9716;
    const destLng = destGeo?.lng || result?.destLocation?.lng || 77.5946;

    evaluateCorridorClimate(originLat, originLng, destLat, destLng, fromLocation, destination)
      .then(corridor => {
        if (isMounted) {
          setClimateData(corridor.originClimate);
          setWeatherCondition(corridor.corridorDominantFactor);
          setIsClimateLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsClimateLoading(false);
      });

    return () => { isMounted = false; };
  }, [fromLocation, destination, fromGeo, destGeo, autoClimateEnabled]);

  const handleRefreshLiveClimate = async () => {
    setIsClimateLoading(true);
    const originLat = fromGeo?.lat || result?.originLocation?.lat || 13.0827;
    const originLng = fromGeo?.lng || result?.originLocation?.lng || 80.2707;
    const destLat = destGeo?.lat || result?.destLocation?.lat || 12.9716;
    const destLng = destGeo?.lng || result?.destLocation?.lng || 77.5946;

    try {
      const corridor = await evaluateCorridorClimate(originLat, originLng, destLat, destLng, fromLocation, destination);
      setClimateData(corridor.originClimate);
      setWeatherCondition(corridor.corridorDominantFactor);
      triggerAnalysis(fromLocation, destination, fromGeo, destGeo, corridor.corridorDominantFactor);
    } catch {
      // fallback
    } finally {
      setIsClimateLoading(false);
    }
  };

  const handleApplyClimateScenario = (scenario: 'cloudburst' | 'fog' | 'heatwave' | 'monsoon' | 'clear') => {
    const preset = generatePresetClimateScenario(scenario);
    setClimateData(preset);
    setWeatherCondition(preset.weatherFactor);
    triggerAnalysis(fromLocation, destination, fromGeo, destGeo, preset.weatherFactor);
  };

  // Auto-fetch real road geometry whenever locations or selected route change
  useEffect(() => {
    let isMounted = true;
    const originLat = fromGeo?.lat || result?.originLocation?.lat || 13.0827;
    const originLng = fromGeo?.lng || result?.originLocation?.lng || 80.2707;
    const destLat = destGeo?.lat || result?.destLocation?.lat || 12.9716;
    const destLng = destGeo?.lng || result?.destLocation?.lng || 77.5946;

    getRouteGeometry(
      { lat: originLat, lng: originLng, name: fromLocation },
      { lat: destLat, lng: destLng, name: destination },
      selectedRouteTab
    ).then(geom => {
      if (isMounted) setRouteGeometry(geom);
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [fromLocation, destination, fromGeo, destGeo, selectedRouteTab]);

  // Filtered locations based on active region
  const availableLocations = useMemo(() => {
    if (activeRegionFilter === 'All India') return INDIA_LOCATIONS;
    return INDIA_LOCATIONS.filter(l => l.region === activeRegionFilter);
  }, [activeRegionFilter]);

  const handleQuickPreset = (originCity: string, destCity: string) => {
    setFromLocation(originCity);
    setDestination(destCity);
    setFromGeo(null);
    setDestGeo(null);
    triggerAnalysis(originCity, destCity);
  };

  const triggerAnalysis = (
    fromLoc = fromLocation, 
    toLoc = destination, 
    fGeo = fromGeo, 
    dGeo = destGeo,
    weatherFac = weatherCondition
  ) => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    setDispatchedRoute(null);

    setTimeout(() => setAnalysisStep(2), 350);
    setTimeout(() => setAnalysisStep(3), 700);
    setTimeout(() => {
      const res = runSmartDecisionEngine({
        fromLocation: fromLoc,
        destination: toLoc,
        fromGeo: fGeo ? { lat: fGeo.lat, lng: fGeo.lng, state: fGeo.state, district: fGeo.district } : undefined,
        destGeo: dGeo ? { lat: dGeo.lat, lng: dGeo.lng, state: dGeo.state, district: dGeo.district } : undefined,
        movementType,
        cargoType,
        vehicleType,
        priority,
        weatherFactor: weatherFac
      });
      setResult(res);
      setSelectedRouteTab('Route B');
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }, 1100);
  };

  const handleAcquireGps = async () => {
    setIsLocatingGps(true);
    try {
      const loc = await getCurrentDeviceLocation();
      setUserGpsLocation({ lat: loc.lat, lng: loc.lng, name: loc.displayName });
      setFromLocation(loc.name);
      setFromGeo(loc);
      triggerAnalysis(loc.name, destination, loc, destGeo);
    } catch (err: any) {
      alert(err.message || 'Unable to access GPS location.');
    } finally {
      setIsLocatingGps(false);
    }
  };

  const handleDispatch = (route: RouteOption) => {
    setDispatchedRoute(route.id);
    if (onRouteSelected) onRouteSelected(route);
  };

  const activeRoute = result?.allRoutes.find(r => r.id === selectedRouteTab) || result?.recommendedRoute;

  return (
    <div id="smart-route-planner" className="space-y-6">
      {/* Header Banner with Pan-India Branding */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-blue-900/60 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              Pan-India & Mountain AI Logistics Intelligence
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>{t('planner_heading', 'Smart Route & Risk Predictor')}</span>
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              {t('planner_subheading', 'Predict routes, terrain elevations, Ghat curves, FASTag tolls, fuel consumption, and weather hazards across all 28 Indian States & 8 Union Territories.')}
            </p>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3 text-right">
            <span className="text-[11px] text-slate-400 block uppercase font-mono">Prediction Model</span>
            <span className="text-sm font-semibold text-emerald-400 flex items-center justify-end gap-1">
              <ShieldCheck className="w-4 h-4" /> Pan-India Multi-Objective Engine
            </span>
            <span className="text-xs text-slate-300 block mt-0.5">Expressway • Ghats • Himalayas • Coastal</span>
          </div>
        </div>

        {/* Quick Corridor Presets across India */}
        <div className="mt-5 pt-4 border-t border-blue-900/40 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-400" /> Quick Corridors:
          </span>
          {[
            { label: 'Chennai ➔ Bengaluru', from: 'Chennai', to: 'Bengaluru' },
            { label: 'Mumbai ➔ Pune', from: 'Mumbai', to: 'Pune' },
            { label: 'Delhi ➔ Mumbai', from: 'New Delhi / NCR', to: 'Mumbai' },
            { label: 'Kolkata ➔ Chennai', from: 'Kolkata', to: 'Chennai' },
            { label: 'Delhi ➔ Srinagar', from: 'New Delhi / NCR', to: 'Srinagar' },
            { label: 'Guwahati ➔ Silchar', from: 'Guwahati', to: 'Silchar' },
            { label: 'Bengaluru ➔ Kochi', from: 'Bengaluru', to: 'Kochi (Cochin)' },
            { label: 'Hyderabad ➔ Vizag', from: 'Hyderabad', to: 'Visakhapatnam (Vizag)' }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => handleQuickPreset(preset.from, preset.to)}
              className="text-xs bg-slate-800/80 hover:bg-blue-600 hover:text-white border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) and AI Route Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Route Configuration Form */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Route Parameters & Terrain
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
              All India
            </span>
          </div>

          {/* Region Tabs */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block text-xs mb-1.5">
              Filter Hubs by Region:
            </label>
            <div className="flex flex-wrap gap-1">
              {(['All India', 'South', 'North', 'West', 'East', 'Central', 'Northeast'] as IndiaRegion[]).map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setActiveRegionFilter(reg)}
                  className={`text-[11px] px-2 py-1 rounded-md font-medium border transition-all ${
                    activeRegionFilter === reg
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Origin Location with Live GPS */}
            <IndiaLocationSearchInput
              label="Origin Location (Pan-India & Villages)"
              placeholder="Search origin village, town, district, pin or city..."
              value={fromLocation}
              isOrigin={true}
              onChange={(name, geoData) => {
                setFromLocation(name);
                if (geoData) {
                  setFromGeo(geoData);
                  triggerAnalysis(name, destination, geoData, destGeo);
                }
              }}
              onGpsAcquired={(loc) => {
                setUserGpsLocation({ lat: loc.lat, lng: loc.lng, name: loc.displayName });
                setFromLocation(loc.name);
                setFromGeo(loc);
                triggerAnalysis(loc.name, destination, loc, destGeo);
              }}
            />

            {/* Destination Location */}
            <IndiaLocationSearchInput
              label="Destination Location (Pan-India & Villages)"
              placeholder="Search destination village, district, hill station..."
              value={destination}
              isOrigin={false}
              onChange={(name, geoData) => {
                setDestination(name);
                if (geoData) {
                  setDestGeo(geoData);
                  triggerAnalysis(fromLocation, name, fromGeo, geoData);
                }
              }}
            />

            {/* Quick Corridor Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                Popular Corridors:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { from: 'Chennai', to: 'Bengaluru', label: 'Chennai → Bengaluru (NH48)' },
                  { from: 'Mumbai', to: 'Pune', label: 'Mumbai → Pune (Expressway)' },
                  { from: 'Delhi', to: 'Jaipur', label: 'Delhi → Jaipur (NH48)' },
                  { from: 'Guwahati', to: 'Shillong', label: 'Guwahati → Shillong (NH6)' },
                  { from: 'Kolkata', to: 'Siliguri', label: 'Kolkata → Siliguri (NH12)' }
                ].map((corridor, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPreset(corridor.from, corridor.to)}
                    className="text-[10px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    {corridor.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Movement Type */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Movement Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Freight', 'Passenger', 'Emergency'] as MovementType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMovementType(type)}
                    className={`py-2 px-2 rounded-lg font-semibold text-center border transition-all ${
                      movementType === type
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Cargo Type */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Cargo Classification
              </label>
              <select
                id="route-cargo-type"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value as CargoType)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Essential Medicines & Vaccines">Essential Medicines & Vaccines (High Perishability)</option>
                <option value="Fresh Agricultural Produce">Fresh Agricultural Produce (Spices, Vegetables, Tea)</option>
                <option value="Petroleum & LPG Fuel">Petroleum & LPG Fuel (Hazardous Class 3)</option>
                <option value="Heavy Construction Machinery">Heavy Construction Machinery (NHAI / NHIDCL)</option>
                <option value="Automobile & Engineering">Automobile Components & Engineering Spares</option>
                <option value="E-Commerce & Express Parcels">E-Commerce & Express High-Speed Parcels</option>
                <option value="Disaster Relief Kits">Disaster Relief Kits (NDRF / SDRF)</option>
                <option value="General Manufactured Goods">General Manufactured Goods</option>
                <option value="Passenger Transit">Passenger Transit (Buses / Shared Vans / Taxis)</option>
              </select>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Vehicle Type & Powertrain
              </label>
              <select
                id="route-vehicle-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Heavy 6-Axle Multi-Axle Truck">Heavy 6-Axle Multi-Axle Truck (40T Gross Freight)</option>
                <option value="Medium 4-Axle Rigid Truck">Medium 4-Axle Rigid Truck (25T Commercial)</option>
                <option value="Heavy Electric Freight Truck (EV)">Heavy Electric Freight Truck (EV - Green Corridor)</option>
                <option value="4x4 Hill Cargo Pickup">4x4 Hill Cargo Pickup (Mahindra Bolero / Isuzu D-Max)</option>
                <option value="Heavy Hill-Bus">Heavy Express Bus (State Transport / Inter-city Sleeper)</option>
                <option value="Light Passenger Van / Tata Sumo">Light Passenger Van / Tata Sumo (Hill / Rural Transit)</option>
                <option value="4WD Emergency Ambulance">4WD Emergency Ambulance (Advanced Life Support)</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Logistics Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal', 'High', 'Emergency'] as PriorityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-2 px-2 rounded-lg font-semibold text-center border transition-all ${
                      priority === lvl
                        ? lvl === 'Emergency'
                          ? 'bg-red-600 text-white border-red-600'
                          : lvl === 'High'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Automated Climate & Weather Intelligence Generator */}
            <div className="pt-2">
              <AutomatedClimateCard
                climate={climateData}
                isLoading={isClimateLoading}
                onRefreshLiveClimate={handleRefreshLiveClimate}
                onApplyScenario={handleApplyClimateScenario}
                locationName={`${fromLocation} ➔ ${destination}`}
                isAutoMode={autoClimateEnabled}
                onToggleAutoMode={() => setAutoClimateEnabled(!autoClimateEnabled)}
              />
            </div>
          </div>

          {/* Analyze Route Button */}
          <button
            id="btn-analyze-route"
            onClick={() => triggerAnalysis()}
            disabled={isAnalyzing}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-75 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {analysisStep === 1 && 'Ingesting National Highway Network & Fastag telemetry...'}
                  {analysisStep === 2 && 'Evaluating Terrain Gradients, Ghat passes & Landslides...'}
                  {analysisStep === 3 && 'Simulating Toll Plazas, Fuel & State Border clearances...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t('btn_calculate', 'Predict Pan-India Route & Risk')}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Section (Right) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Location Summary Strip */}
          {result?.originLocation && result?.destLocation && (
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Origin</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {result.originLocation.name} ({result.originLocation.state})
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Alt: {result.originLocation.elevationMeters}m • {result.originLocation.terrainType} • {result.originLocation.region} India
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center text-slate-400 gap-2">
                <div className="h-[2px] w-12 bg-slate-300 dark:bg-slate-700" />
                <ArrowRight className="w-4 h-4 text-blue-500" />
                <div className="h-[2px] w-12 bg-slate-300 dark:bg-slate-700" />
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Destination</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {result.destLocation.name} ({result.destLocation.state})
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Alt: {result.destLocation.elevationMeters}m • {result.destLocation.terrainType} • {result.destLocation.region} India
                  </span>
                </div>
              </div>

              {climateData && (
                <div className="w-full sm:w-auto text-left sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-4">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Automated Climate</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                    {climateData.temperature}°C • {climateData.weatherFactor}
                  </span>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                    {climateData.precipitationMm > 0 ? `${climateData.precipitationMm} mm/h rain` : 'Dry Roadbed'} • μ={climateData.roadSurfaceFriction}
                  </span>
                </div>
              )}

              <div className="w-full sm:w-auto text-right sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-4">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Est. FASTag &amp; Tolls</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                  <Receipt className="w-3.5 h-3.5 text-blue-500" />
                  ₹{result.fastagTollEstimateInr?.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {result.tollPlazaCount} Toll Plazas
                </span>
              </div>
            </div>
          )}

          {/* Real Interactive Leaflet Route Map with GPS & Villages */}
          <div id="pan-india-route-map" className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 scroll-mt-20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Pan-India Live Interactive Map &amp; Route Guidance</span>
                    {routeGeometry && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                        {routeGeometry.distanceKm} km • {Math.floor(routeGeometry.durationMinutes / 60)}h {routeGeometry.durationMinutes % 60}m
                      </span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                      Tracking: {selectedRouteTab}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Showing road corridors between {fromLocation} and {destination} with live GPS and simulated route-following
                  </p>
                </div>
              </div>

              {userGpsLocation && (
                <div className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-semibold text-[11px]">GPS Active: {userGpsLocation.name}</span>
                </div>
              )}
            </div>

            <RealLeafletMap
              origin={fromGeo ? { lat: fromGeo.lat, lng: fromGeo.lng, name: fromGeo.name } : result?.originLocation ? { lat: result.originLocation.lat, lng: result.originLocation.lng, name: result.originLocation.name } : null}
              destination={destGeo ? { lat: destGeo.lat, lng: destGeo.lng, name: destGeo.name } : result?.destLocation ? { lat: result.destLocation.lat, lng: result.destLocation.lng, name: result.destLocation.name } : null}
              routeGeometry={routeGeometry}
              userGpsLocation={userGpsLocation}
              onLocateMeClick={handleAcquireGps}
              isLocating={isLocatingGps}
              selectedRouteName={activeRoute?.title || selectedRouteTab}
              activeRouteId={selectedRouteTab}
              climateData={climateData}
            />
          </div>

          {/* Key Principle Highlight Banner */}
          <div className="bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl p-4 flex items-start gap-3 text-blue-950 dark:text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold block text-sm mb-0.5">
                Pan-India Terrain Intelligence: Safety &amp; All-Weather Reliability
              </span>
              Whether crossing the Western Ghats (Khandala/Shiradi/Charmadi), Himalayan mountain passes (Sela/Atal/Banihal), or national high-speed expressways, SmartMove AI optimizes <span className="font-semibold">elevation gradient, hairpin curves, monsoon landslide vulnerability, FASTag toll costs, and 4G/5G fleet telemetry</span>.
            </div>
          </div>

          {/* Route Comparison Cards (Route A, Route B, Route C) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result?.allRoutes.map((route) => {
              const isBest = route.decision === 'Best Route';
              const isAvoid = route.decision === 'Avoid';
              const isAlt = route.decision === 'Alternative Route';
              const isSelected = selectedRouteTab === route.id;

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteTab(route.id as any)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? isBest
                        ? 'bg-emerald-950/20 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                        : isAvoid
                        ? 'bg-red-950/20 dark:bg-red-950/40 border-red-500 shadow-md ring-2 ring-red-500/30'
                        : 'bg-amber-950/20 dark:bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {route.id}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isBest
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isAvoid
                          ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isBest && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isAvoid && <XCircle className="w-3.5 h-3.5" />}
                      {isAlt && <AlertTriangle className="w-3.5 h-3.5" />}
                      {route.decision}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate mb-1">
                    {route.nationalHighways?.[0] || 'National Corridor'}
                  </p>

                  {/* Core Metrics */}
                  <div className="space-y-2 text-xs border-y border-slate-100 dark:border-slate-800 py-3 my-1">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Milestone className="w-3.5 h-3.5 text-blue-500" /> Distance
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{route.distanceKm} km</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" /> Time
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{route.timeHours} hrs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> Risk Score
                      </span>
                      <span className={`font-bold ${
                        route.riskPercent > 60 ? 'text-red-600 dark:text-red-400' :
                        route.riskPercent > 30 ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {route.riskPercent}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Fuel className="w-3.5 h-3.5 text-cyan-500" /> Est. Cost
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{(route.fuelCostInr || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {route.via}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRouteTab(route.id as any);
                        handleDispatch(route);
                        const mapElem = document.getElementById('pan-india-route-map');
                        if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isBest
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : isAvoid
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled={isAvoid}
                    >
                      {dispatchedRoute === route.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> {t('btn_dispatched', 'Dispatched')}
                        </>
                      ) : isBest ? (
                        <>
                          <Send className="w-3.5 h-3.5" /> {t('btn_select_best', 'Select Best Route')}
                        </>
                      ) : isAvoid ? (
                        'Hazardous'
                      ) : (
                        t('btn_select_alternate', 'Select Alternate')
                      )}
                    </button>

                    {!isAvoid && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRouteTab(route.id as any);
                          const mapElem = document.getElementById('pan-india-route-map');
                          if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="py-2 px-2.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                        title="Follow this route path live on map"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{t('btn_follow_route', 'Follow')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Inspection Panel for Selected Route */}
          {activeRoute && (
            <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Detailed Corridor Intelligence &amp; Elevation Profile
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeRoute.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const mapElem = document.getElementById('pan-india-route-map');
                      if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-xs font-semibold hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Follow Route On Map
                  </button>
                  {triggerDriverView && (
                    <button
                      onClick={() => triggerDriverView(activeRoute)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                    >
                      Send to Driver Mobile HUD <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Safety Verdict */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs leading-relaxed space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  Safety Verdict &amp; Route Dynamics:
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {activeRoute.safetyVerdict}
                </p>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  {activeRoute.terrainSummary}
                </p>
              </div>

              {/* Factor Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 mb-1">
                    <Mountain className="w-3.5 h-3.5 text-blue-400" /> Max Altitude
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeRoute.factors.elevationMaxMeters} m
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {activeRoute.factors.hairpinBends} Curves / Bends
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 mb-1">
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" /> FASTag Toll Plazas
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeRoute.tollPlazaCount || 4} Plazas
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ~₹{(activeRoute.fastagTollEstimateInr || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 mb-1">
                    <Wifi className="w-3.5 h-3.5 text-purple-400" /> Network Coverage
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeRoute.factors.networkAvailability}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Fleet GPS Ping</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 mb-1">
                    <Fuel className="w-3.5 h-3.5 text-cyan-400" /> Fuel / Energy
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {vehicleType.includes('EV') 
                      ? `${Math.round(activeRoute.distanceKm * 0.9)} kWh`
                      : `~${Math.round(activeRoute.distanceKm / (vehicleType.includes('6-Axle') ? 3.2 : 4.5))} L`}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ₹{(activeRoute.fuelCostInr || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Terrain Elevation Progression Graphic */}
              {activeRoute.elevationProfile && activeRoute.elevationProfile.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Elevation Profile Along Highway
                    </span>
                    <span className="text-[11px] text-slate-400">Sea Level to Pass Height</span>
                  </div>

                  {/* Elevation Bars */}
                  <div className="h-16 flex items-end gap-2 pt-2">
                    {activeRoute.elevationProfile.map((point, idx) => {
                      const maxProfile = Math.max(...activeRoute.elevationProfile!.map(p => p.elevationM), 500);
                      const heightPct = Math.max(15, Math.round((point.elevationM / maxProfile) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                          <span className="text-[9px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 bg-slate-800 text-white px-1 py-0.5 rounded">
                            {point.elevationM}m
                          </span>
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-md transition-all duration-500"
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full text-center">
                            {point.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

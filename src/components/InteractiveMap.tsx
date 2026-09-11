import React, { useState, useEffect } from 'react';
import { CITY_NODES, ROAD_SEGMENTS, ACTIVE_VEHICLES } from '../data/mockData';
import { INDIA_LOCATIONS, PAN_INDIA_CORRIDORS } from '../data/indiaLocations';
import { RoadSegment, MapCityNode, ActiveVehicle, IndiaLocation } from '../types';
import { RealLeafletMap } from './RealLeafletMap';
import { getCurrentDeviceLocation, getRouteGeometry, RouteGeometryResult } from '../utils/indiaGeoService';
import { 
  Truck, 
  Bus, 
  AlertTriangle, 
  CloudRain, 
  WifiOff, 
  Radio, 
  Maximize2, 
  Info, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Compass,
  Building2,
  Fuel,
  Navigation,
  Globe2,
  Layers,
  MapPin,
  TrendingUp,
  Receipt,
  Crosshair
} from 'lucide-react';

interface InteractiveMapProps {
  selectedRoadId?: string | null;
  onSelectRoad?: (road: RoadSegment | null) => void;
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: ActiveVehicle | null) => void;
  highlightRouteId?: string | null;
  filterStatus?: string;
  className?: string;
  isOffline?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedRoadId,
  onSelectRoad,
  selectedVehicleId,
  onSelectVehicle,
  highlightRouteId,
  filterStatus,
  className = '',
  isOffline = false
}) => {
  // Mode: Leaflet Live Map vs Pan-India National Network vs NER Deep-Dive
  const [mapScope, setMapScope] = useState<'leaflet' | 'pan-india' | 'ner'>('leaflet');
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const CORRIDOR_PRESETS = [
    { name: 'Chennai ➔ Bengaluru (NH48)', origin: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' }, dest: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru, Karnataka' } },
    { name: 'Mumbai ➔ Pune (Expwy)', origin: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' }, dest: { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' } },
    { name: 'Guwahati ➔ Shillong (NER)', origin: { lat: 26.1445, lng: 91.7362, name: 'Guwahati, Assam' }, dest: { lat: 25.5788, lng: 91.8933, name: 'Shillong, Meghalaya' } },
    { name: 'Delhi ➔ Jaipur (NH48)', origin: { lat: 28.6139, lng: 77.2090, name: 'Delhi, NCR' }, dest: { lat: 26.9124, lng: 75.7873, name: 'Jaipur, Rajasthan' } }
  ];

  const [selectedCorridor, setSelectedCorridor] = useState(CORRIDOR_PRESETS[0]);
  const [corridorGeometry, setCorridorGeometry] = useState<RouteGeometryResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    getRouteGeometry(selectedCorridor.origin, selectedCorridor.dest)
      .then(res => {
        if (isMounted) setCorridorGeometry(res);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [selectedCorridor]);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentDeviceLocation();
      setGpsLocation({ lat: loc.lat, lng: loc.lng, name: loc.displayName });
    } catch (err: any) {
      alert(err.message || 'Unable to access location.');
    } finally {
      setIsLocating(false);
    }
  };

  // Layer Toggles
  const [activeLayerRoads, setActiveLayerRoads] = useState(true);
  const [activeLayerVehicles, setActiveLayerVehicles] = useState(true);
  const [activeLayerLandslides, setActiveLayerLandslides] = useState(true);
  const [activeLayerWeather, setActiveLayerWeather] = useState(true);
  const [activeLayerHospitals, setActiveLayerHospitals] = useState(false);
  const [activeLayerNetwork, setActiveLayerNetwork] = useState(false);

  // Inspector State
  const [inspectorItem, setInspectorItem] = useState<{
    type: 'road' | 'node' | 'vehicle' | 'india-node' | 'corridor';
    data: any;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);

  // Road color helper
  const getRoadColor = (status: RoadSegment['status']) => {
    switch (status) {
      case 'Road Blocked': return '#ef4444'; // Red
      case 'High Risk': return '#f97316';   // Orange
      case 'Moderate Risk': return '#eab308'; // Yellow
      case 'Safe': return '#22c55e';        // Green
      default: return '#94a3b8';
    }
  };

  const filteredRoads = ROAD_SEGMENTS.filter(road => {
    if (!filterStatus || filterStatus === 'all') return true;
    if (filterStatus === 'blocked') return road.status === 'Road Blocked';
    if (filterStatus === 'high-risk') return road.status === 'High Risk';
    if (filterStatus === 'safe') return road.status === 'Safe';
    return true;
  });

  const handleRoadClick = (road: RoadSegment) => {
    if (onSelectRoad) onSelectRoad(road);
    setInspectorItem({ type: 'road', data: road });
  };

  const handleVehicleClick = (vehicle: ActiveVehicle) => {
    if (onSelectVehicle) onSelectVehicle(vehicle);
    setInspectorItem({ type: 'vehicle', data: vehicle });
  };

  const handleNodeClick = (node: MapCityNode) => {
    setInspectorItem({ type: 'node', data: node });
  };

  const handleIndiaNodeClick = (node: IndiaLocation) => {
    setInspectorItem({ type: 'india-node', data: node });
  };

  const handleCorridorClick = (corridor: typeof PAN_INDIA_CORRIDORS[0]) => {
    setInspectorItem({ type: 'corridor', data: corridor });
  };

  return (
    <div id="ner-interactive-map-container" className={`relative bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Top Map Header & Scope Switcher */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/60 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {mapScope === 'pan-india' ? 'Pan-India National Highway & Freight Network' : 'Northeast India Terrain & Logistics Grid'}
              </h3>
              {isOffline && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
                  Offline Vector Cache
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {mapScope === 'pan-india' 
                ? 'Golden Quadrilateral • North-South & East-West Expressways • Ghat Roads & Hill Passes' 
                : 'Live multi-layer GIS: 8 States • Brahmaputra & Barak Valleys • Mountain Corridors'}
            </p>
          </div>
        </div>

        {/* Scope Switcher: All India vs NER */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/90 p-0.5 rounded-lg border border-slate-700 flex items-center text-xs">
            <button
              onClick={() => setMapScope('leaflet')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapScope === 'leaflet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              Live Street &amp; Village Map
            </button>
            <button
              onClick={() => setMapScope('pan-india')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapScope === 'pan-india'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              National Corridors
            </button>
            <button
              onClick={() => setMapScope('ner')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapScope === 'ner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Northeast Terrain Focus
            </button>
          </div>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setActiveLayerRoads(!activeLayerRoads)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeLayerRoads ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Corridors
          </button>
          <button
            onClick={() => setActiveLayerVehicles(!activeLayerVehicles)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeLayerVehicles ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Fleets (Blue)
          </button>
          <button
            onClick={() => setActiveLayerLandslides(!activeLayerLandslides)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeLayerLandslides ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Ghat / Hazard
          </button>
          <button
            onClick={() => setActiveLayerWeather(!activeLayerWeather)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeLayerWeather ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Weather
          </button>
          <button
            onClick={() => setActiveLayerNetwork(!activeLayerNetwork)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeLayerNetwork ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            Blindspots
          </button>
          <button
            onClick={() => setActiveLayerHospitals(!activeLayerHospitals)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeLayerHospitals ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Facilities
          </button>
        </div>
      </div>

      {/* Corridor Quick Selector for Leaflet Follow Mode */}
      {mapScope === 'leaflet' && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>Corridor:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CORRIDOR_PRESETS.map((c) => {
                const isSelected = selectedCorridor.name === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedCorridor(c)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click <strong className="text-sky-400">"Follow Route Live"</strong> on map to simulate vehicle transit
          </span>
        </div>
      )}

      {/* Map Canvas / SVG Area */}
      <div className="relative flex-1 min-h-[480px] md:min-h-[560px] bg-slate-950 overflow-hidden select-none">
        {mapScope === 'leaflet' ? (
          <RealLeafletMap
            origin={selectedCorridor.origin}
            destination={selectedCorridor.dest}
            routeGeometry={corridorGeometry}
            selectedRouteName={selectedCorridor.name}
            activeRouteId="Express Corridor"
            userGpsLocation={gpsLocation}
            onLocateMeClick={handleLocateMe}
            isLocating={isLocating}
            className="w-full h-full min-h-[540px]"
          />
        ) : (
          <>
            {/* Topographic grid texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {mapScope === 'pan-india' ? (
          /* PAN-INDIA GEOGRAPHIC SVG */
          <svg
            viewBox="0 0 1000 850"
            className="w-full h-full object-contain filter drop-shadow-md cursor-grab active:cursor-grabbing"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease-out' }}
          >
            <defs>
              <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow-gq" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* India Continental Map Outline Silhouette */}
            <g id="india-landmass" opacity="0.4">
              {/* Generalized boundary path of India */}
              <path
                d="M 360,60 
                   L 420,50 L 450,90 L 480,120 L 520,150 L 500,190 L 540,210 L 610,210 L 670,240 L 760,230 L 840,240 L 890,280 L 820,330 L 760,330 L 730,370 L 670,360 L 630,420 L 590,470 L 550,560 L 510,640 L 470,720 L 440,790 L 420,770 L 390,700 L 370,640 L 360,560 L 330,480 L 290,440 L 270,390 L 230,360 L 220,320 L 250,260 L 290,210 L 330,140 Z"
                fill="url(#indiaGrad)"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Northeast Wing Connection */}
              <path
                d="M 730,240 L 860,230 L 920,270 L 890,340 L 840,360 L 780,310 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />
            </g>

            {/* Weather Radar Overlays across India */}
            {activeLayerWeather && (
              <g id="india-weather-radar">
                {/* Western Ghats Monsoon Rainfall Belt */}
                <ellipse cx="370" cy="620" rx="40" ry="120" fill="#3b82f6" fillOpacity="0.18" stroke="#60a5fa" strokeDasharray="4 2" />
                <text x="310" y="580" fill="#93c5fd" fontSize="10" fontWeight="bold">WESTERN GHATS MONSOON</text>

                {/* Bay of Bengal / Eastern Coast Sea Winds */}
                <circle cx="680" cy="540" r="60" fill="#3b82f6" fillOpacity="0.15" stroke="#38bdf8" />
                <text x="640" y="540" fill="#7dd3fc" fontSize="10" fontStyle="italic">Coastal Gale Alert</text>

                {/* Indo-Gangetic Fog / Smog zone */}
                <ellipse cx="480" cy="240" rx="90" ry="35" fill="#a855f7" fillOpacity="0.16" stroke="#c084fc" strokeDasharray="3 3" />
                <text x="430" y="240" fill="#e9d5ff" fontSize="10" fontWeight="bold">WINTER FOG / SMOG (LOW VISIBILITY)</text>
              </g>
            )}

            {/* Ghat Road / High Mountain Warning Nodes */}
            {activeLayerLandslides && (
              <g id="india-mountain-ghats">
                {/* Khandala Ghat (Mumbai-Pune) */}
                <g transform="translate(345, 480)" className="cursor-pointer">
                  <circle cx="0" cy="0" r="8" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
                  <text x="12" y="4" fill="#fdba74" fontSize="9" fontWeight="bold">Khandala Ghat (Fog/Rain)</text>
                </g>
                {/* Shiradi / Charmadi Ghat (Karnataka) */}
                <g transform="translate(375, 620)" className="cursor-pointer">
                  <circle cx="0" cy="0" r="8" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
                  <text x="12" y="4" fill="#fdba74" fontSize="9" fontWeight="bold">Shiradi Ghat</text>
                </g>
                {/* Zoji La & Banihal Passes (J&K) */}
                <g transform="translate(385, 110)" className="cursor-pointer">
                  <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                  <text x="14" y="4" fill="#fca5a5" fontSize="9" fontWeight="bold">Banihal &amp; Zoji La Pass</text>
                </g>
                {/* Sela Pass (Arunachal) */}
                <g transform="translate(855, 255)" className="cursor-pointer">
                  <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="-90" y="-8" fill="#fca5a5" fontSize="9" fontWeight="bold">Sela Pass (3,100m)</text>
                </g>
              </g>
            )}

            {/* National Corridors (Golden Quadrilateral & Spines) */}
            {activeLayerRoads && (
              <g id="india-national-highways">
                {PAN_INDIA_CORRIDORS.map((corridor) => {
                  const points = corridor.routePoints;
                  const pathD = points.reduce((acc, pt, idx) => {
                    return idx === 0 ? `M ${pt[0]} ${pt[1]}` : `${acc} L ${pt[0]} ${pt[1]}`;
                  }, '');

                  return (
                    <g key={corridor.id} className="cursor-pointer group" onClick={() => handleCorridorClick(corridor)}>
                      {/* Wider hit zone */}
                      <path d={pathD} fill="none" stroke="transparent" strokeWidth="16" />
                      {/* Base outline */}
                      <path d={pathD} fill="none" stroke="#020617" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Active Highway Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={corridor.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:stroke-white transition-colors"
                      />
                      {/* Animated traffic dot */}
                      <circle r="3.5" fill="#ffffff">
                        <animateMotion path={pathD} dur="10s" repeatCount="indefinite" />
                      </circle>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Active Pan-India Freight Fleets */}
            {activeLayerVehicles && (
              <g id="india-active-fleets">
                {[
                  { id: 'trk-in-1', reg: 'TN-01-AX-9921', x: 440, y: 700, route: 'Chennai-Bengaluru Express' },
                  { id: 'trk-in-2', reg: 'MH-12-QE-4482', x: 340, y: 460, route: 'Mumbai-Pune Yashwantrao' },
                  { id: 'trk-in-3', reg: 'DL-01-AB-1090', x: 430, y: 250, route: 'Delhi-Mumbai Expressway' },
                  { id: 'trk-in-4', reg: 'KA-04-EV-8002', x: 410, y: 640, route: 'Bengaluru-Hyderabad NH-44' },
                  { id: 'trk-in-5', reg: 'AS-01-BC-5520', x: 840, y: 280, route: 'East-West Corridor NH-27' },
                  { id: 'trk-in-6', reg: 'WB-19-DF-3341', x: 670, y: 380, route: 'Kolkata-Bhubaneswar NH-16' }
                ].map((v) => (
                  <g key={v.id} transform={`translate(${v.x}, ${v.y})`} className="cursor-pointer group">
                    <circle cx="0" cy="0" r="14" fill="#0284c7" fillOpacity="0.25" className="animate-ping" />
                    <circle cx="0" cy="0" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" filter="url(#glow-gq)" />
                    <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
                    <g transform="translate(10, -6)" className="opacity-90 group-hover:opacity-100 pointer-events-none">
                      <rect x="0" y="0" width="70" height="14" rx="3" fill="#0f172a" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="0.7" />
                      <text x="35" y="10" fill="#e0f2fe" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {v.reg}
                      </text>
                    </g>
                  </g>
                ))}
              </g>
            )}

            {/* Pan-India Major City Nodes */}
            <g id="india-city-nodes">
              {INDIA_LOCATIONS.map((city) => {
                const svgX = city.x * 10;
                const svgY = city.y * 8.5;
                const isMetropolis = ['chennai', 'bengaluru', 'mumbai', 'delhi', 'kolkata', 'hyderabad'].includes(city.id);

                return (
                  <g
                    key={city.id}
                    transform={`translate(${svgX}, ${svgY})`}
                    onClick={() => handleIndiaNodeClick(city)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r={isMetropolis ? 7.5 : 5}
                      fill="#0f172a"
                      stroke={isMetropolis ? '#38bdf8' : '#94a3b8'}
                      strokeWidth={isMetropolis ? 2.5 : 1.5}
                      className="group-hover:stroke-amber-400 group-hover:scale-125 transition-transform"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r={isMetropolis ? 3.5 : 2}
                      fill={isMetropolis ? '#38bdf8' : '#cbd5e1'}
                    />
                    <text
                      x="0"
                      y={isMetropolis ? -12 : -8}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize={isMetropolis ? '11' : '8.5'}
                      fontWeight={isMetropolis ? '700' : '600'}
                      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wide group-hover:fill-blue-300"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        ) : (
          /* NORTHEAST REGIONAL DETAIL SVG */
          <svg
            viewBox="0 0 1000 650"
            className="w-full h-full object-contain filter drop-shadow-md cursor-grab active:cursor-grabbing"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease-out' }}
          >
            <defs>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* NER State polygons */}
            <g id="terrain-regions" opacity="0.45">
              <path d="M 280,70 L 620,110 L 890,140 L 920,220 L 760,250 L 520,240 L 320,190 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="560" y="150" fill="#64748b" fontSize="14" fontWeight="600" letterSpacing="4">ARUNACHAL PRADESH</text>
              <path d="M 290,260 L 510,240 L 780,250 L 860,210 L 840,290 L 720,330 L 480,330 L 300,340 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <path d="M 870,190 Q 750,260 520,275 T 260,330" fill="none" stroke="url(#riverGrad)" strokeWidth="9" strokeLinecap="round" />
              <text x="440" y="300" fill="#38bdf8" opacity="0.6" fontSize="12" fontStyle="italic">Brahmaputra River Corridor</text>
              <path d="M 290,350 L 460,350 L 490,440 L 320,440 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
              <text x="340" y="400" fill="#94a3b8" fontSize="13" fontWeight="600">MEGHALAYA</text>
              <path d="M 720,300 L 820,320 L 810,410 L 720,390 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="735" y="360" fill="#94a3b8" fontSize="12" fontWeight="600">NAGALAND</text>
              <path d="M 710,400 L 810,415 L 790,520 L 690,490 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="725" y="460" fill="#94a3b8" fontSize="12" fontWeight="600">MANIPUR</text>
              <path d="M 480,480 L 600,480 L 590,620 L 490,610 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="510" y="560" fill="#94a3b8" fontSize="12" fontWeight="600">MIZORAM</text>
              <path d="M 280,480 L 390,480 L 380,590 L 270,570 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="300" y="540" fill="#94a3b8" fontSize="12" fontWeight="600">TRIPURA</text>
            </g>

            {/* NER Roads */}
            {activeLayerRoads && (
              <g id="layer-roads">
                {filteredRoads.map(road => {
                  const isSelected = selectedRoadId === road.id;
                  const strokeColor = getRoadColor(road.status);
                  const pathD = road.pathCoords.reduce((acc, coord, idx) => {
                    const svgX = coord[0] * 10;
                    const svgY = coord[1] * 6.5;
                    return idx === 0 ? `M ${svgX} ${svgY}` : `${acc} L ${svgX} ${svgY}`;
                  }, '');

                  return (
                    <g key={road.id} className="cursor-pointer group" onClick={() => handleRoadClick(road)}>
                      <path d={pathD} fill="none" stroke="transparent" strokeWidth="20" />
                      <path d={pathD} fill="none" stroke="#020617" strokeWidth={isSelected ? '8' : '5'} strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isSelected ? '6' : '3.5'}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={road.status === 'Road Blocked' ? '7 4' : undefined}
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* NER City Nodes */}
            <g id="ner-city-nodes">
              {CITY_NODES.map(node => {
                const svgX = node.x * 10;
                const svgY = node.y * 6.5;
                const isCapital = node.type === 'Capital';
                return (
                  <g key={node.id} transform={`translate(${svgX}, ${svgY})`} onClick={() => handleNodeClick(node)} className="cursor-pointer group">
                    <circle cx="0" cy="0" r={isCapital ? 9 : 6.5} fill="#0f172a" stroke={isCapital ? '#38bdf8' : '#94a3b8'} strokeWidth={isCapital ? 2.5 : 1.5} />
                    <circle cx="0" cy="0" r={isCapital ? 4 : 2.5} fill={isCapital ? '#38bdf8' : '#cbd5e1'} />
                    <text x="0" y={isCapital ? -13 : -10} textAnchor="middle" fill="#f8fafc" fontSize={isCapital ? '11' : '9.5'} fontWeight={isCapital ? '700' : '600'}>
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-lg p-3 text-xs shadow-xl max-w-xs z-10">
          <div className="font-bold text-white mb-2 flex items-center justify-between border-b border-slate-700 pb-1">
            <span>{mapScope === 'pan-india' ? 'National Logistics Legend' : 'NER Mountain Status'}</span>
            <span className="text-[10px] text-slate-400 font-mono">NHAI / MoRTH</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-medium">Expressways / GQ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="font-medium">Ghat / Mountain Pass</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium">Hazard / Red Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
              <span className="font-semibold text-sky-300">Active Freight Fleets</span>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="w-8 h-8 rounded-md bg-slate-800/90 text-white flex items-center justify-center hover:bg-slate-700 border border-slate-700 shadow cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="w-8 h-8 rounded-md bg-slate-800/90 text-white flex items-center justify-center hover:bg-slate-700 border border-slate-700 shadow cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-8 h-8 rounded-md bg-slate-800/90 text-slate-300 flex items-center justify-center hover:bg-slate-700 border border-slate-700 shadow text-[10px] font-mono cursor-pointer"
            title="Reset Zoom"
          >
            1x
          </button>
        </div>
        </>
      )}
      </div>

      {/* Slide-in Inspector Drawer when Road or Vehicle or City is clicked */}
      {inspectorItem && (
        <div className="bg-slate-850 border-t border-slate-700 p-4 animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              {inspectorItem.type === 'india-node' && (
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <MapPin className="w-5 h-5" />
                </div>
              )}
              {inspectorItem.type === 'corridor' && (
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Navigation className="w-5 h-5" />
                </div>
              )}
              {inspectorItem.type === 'road' && (
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                  <Navigation className="w-5 h-5" />
                </div>
              )}
              {inspectorItem.type === 'node' && (
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Compass className="w-5 h-5" />
                </div>
              )}
              {inspectorItem.type === 'vehicle' && (
                <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
                  <Truck className="w-5 h-5" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-white">
                  {inspectorItem.type === 'india-node' && `${inspectorItem.data.name}, ${inspectorItem.data.state} (${inspectorItem.data.region} India)`}
                  {inspectorItem.type === 'corridor' && `${inspectorItem.data.name} (${inspectorItem.data.lengthKm} km)`}
                  {inspectorItem.type === 'road' && `${inspectorItem.data.name} (${inspectorItem.data.highwayNumber})`}
                  {inspectorItem.type === 'node' && `${inspectorItem.data.name}, ${inspectorItem.data.state}`}
                  {inspectorItem.type === 'vehicle' && `${inspectorItem.data.registrationNumber} • ${inspectorItem.data.vehicleModel}`}
                </h4>
                <p className="text-xs text-slate-400">
                  {inspectorItem.type === 'india-node' && `Altitude: ${inspectorItem.data.elevationMeters}m • Terrain: ${inspectorItem.data.terrainType} • Weather: ${inspectorItem.data.weather.condition} (${inspectorItem.data.weather.tempC}°C)`}
                  {inspectorItem.type === 'corridor' && `Average Transit: ${inspectorItem.data.avgTravelTimeHours} Hours • Risk Rating: ${inspectorItem.data.riskCategory} • Status: ${inspectorItem.data.status}`}
                  {inspectorItem.type === 'road' && `Status: ${inspectorItem.data.status} • Risk Score: ${inspectorItem.data.riskScore}/100 • Length: ${inspectorItem.data.lengthKm} km`}
                  {inspectorItem.type === 'node' && `Elevation: ${inspectorItem.data.elevationMeters}m • Type: ${inspectorItem.data.type}`}
                  {inspectorItem.type === 'vehicle' && `Driver: ${inspectorItem.data.driverName} • Speed: ${inspectorItem.data.speedKmh} km/h • Route: ${inspectorItem.data.routeAssigned}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setInspectorItem(null)}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-750 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Extra Details */}
          <div className="mt-3 text-xs grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-slate-300">
            {inspectorItem.type === 'india-node' && (
              <>
                <div>
                  <span className="text-slate-400 block">Major National Highways:</span>
                  <span className="font-semibold text-white">{inspectorItem.data.majorHighways.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Precipitation &amp; Wind:</span>
                  <span className="font-medium text-blue-300">{inspectorItem.data.weather.rainfallMm} mm • {inspectorItem.data.weather.windKmh} km/h wind</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Humidity &amp; Air:</span>
                  <span className="font-medium text-slate-200">{inspectorItem.data.weather.humidity}% Rel. Humidity</span>
                </div>
              </>
            )}
            {inspectorItem.type === 'corridor' && (
              <>
                <div>
                  <span className="text-slate-400 block">Key Corridor Stretches:</span>
                  <span className="font-semibold text-white">{inspectorItem.data.description}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Terrain Category:</span>
                  <span className="font-medium text-amber-300">{inspectorItem.data.terrain}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">FASTag &amp; Pavement:</span>
                  <span className="font-medium text-emerald-300">Fully Electronic FASTag Express Lanes</span>
                </div>
              </>
            )}
            {inspectorItem.type === 'road' && (
              <>
                <div>
                  <span className="text-slate-400 block">Condition:</span>
                  <span className="font-medium text-slate-200">{inspectorItem.data.condition}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Landslide Risk:</span>
                  <span className="font-semibold text-orange-400">{inspectorItem.data.landslideRisk}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Network Coverage:</span>
                  <span className="font-medium text-purple-300">{inspectorItem.data.networkCoverage}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

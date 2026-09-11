import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Crosshair, 
  Layers, 
  Compass, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Milestone,
  AlertTriangle,
  Radio,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Video,
  Truck,
  Zap,
  FastForward,
  CloudRain,
  Sun,
  CloudFog
} from 'lucide-react';
import { RouteGeometryResult } from '../utils/indiaGeoService';
import { AutomatedClimateData } from '../utils/climateService';

interface RealLeafletMapProps {
  origin?: { lat: number; lng: number; name: string } | null;
  destination?: { lat: number; lng: number; name: string } | null;
  routeGeometry?: RouteGeometryResult | null;
  userGpsLocation?: { lat: number; lng: number; name: string } | null;
  onLocateMeClick?: () => void;
  isLocating?: boolean;
  className?: string;
  hazardAlerts?: { lat: number; lng: number; title: string; severity: string }[];
  selectedRouteName?: string;
  activeRouteId?: string;
  autoStartSimulation?: boolean;
  climateData?: AutomatedClimateData | null;
}

// Computes compass heading / bearing between two coordinates in degrees (0 - 360)
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  origin,
  destination,
  routeGeometry,
  userGpsLocation,
  onLocateMeClick,
  isLocating = false,
  className = '',
  hazardAlerts = [],
  selectedRouteName,
  activeRouteId,
  autoStartSimulation = false,
  climateData
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const traveledLayerRef = useRef<L.Polyline | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const radarLayerRef = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'streets' | 'dark' | 'topo'>('dark');
  const [showWeatherRadar, setShowWeatherRadar] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulation State: Following the selected route
  const [isSimulating, setIsSimulating] = useState(autoStartSimulation);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simSpeed, setSimSpeed] = useState<number>(2); // Multiplier: 1, 2, 5, 10
  const [autoFollowCamera, setAutoFollowCamera] = useState(true);
  const [simCompleted, setSimCompleted] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const initialLat = origin?.lat || 20.5937;
    const initialLng = origin?.lng || 78.9629;
    const initialZoom = origin && destination ? 6 : 5;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';
    let maxZoom = 19;

    if (mapStyle === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
    } else {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = 'abc';
    }

    L.tileLayer(tileUrl, {
      subdomains,
      maxZoom,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  }, [mapStyle]);

  // Doppler Weather Radar Overlay Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
      radarLayerRef.current = null;
    }

    if (showWeatherRadar) {
      // RainViewer Doppler precipitation radar layer
      const radarLayer = L.tileLayer('https://tilecache.rainviewer.com/v2/radar/nowcast_0/256/{z}/{x}/{y}/2/1_1.png', {
        opacity: 0.62,
        maxZoom: 18,
        zIndex: 350
      }).addTo(map);
      radarLayerRef.current = radarLayer;
    }

    return () => {
      if (radarLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(radarLayerRef.current);
        radarLayerRef.current = null;
      }
    };
  }, [showWeatherRadar]);

  // Reset simulation whenever route coordinates change
  useEffect(() => {
    setCurrentStepIndex(0);
    setSimCompleted(false);
    if (vehicleMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(vehicleMarkerRef.current);
      vehicleMarkerRef.current = null;
    }
    if (traveledLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(traveledLayerRef.current);
      traveledLayerRef.current = null;
    }
  }, [routeGeometry?.coordinates, activeRouteId]);

  // Update Route Polylines & Static Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (traveledLayerRef.current) {
      map.removeLayer(traveledLayerRef.current);
      traveledLayerRef.current = null;
    }

    const bounds = L.latLngBounds([]);

    // 1. Draw Route Polyline
    if (routeGeometry && routeGeometry.coordinates.length > 0) {
      // Outer glow / shadow
      L.polyline(routeGeometry.coordinates, {
        color: '#0284c7',
        weight: 10,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(markerGroup);

      // Main Route line
      const polyline = L.polyline(routeGeometry.coordinates, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Traveled portion polyline (initially empty)
      const traveledPolyline = L.polyline([], {
        color: '#10b981',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      traveledLayerRef.current = traveledPolyline;

      bounds.extend(polyline.getBounds());
    }

    // 2. Custom Icon Generator
    const createHtmlIcon = (bgColor: string, text: string, iconType: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 14px rgba(0,0,0,0.5); border: 2.5px solid white;">
              ${iconType}
            </div>
            <div style="position: absolute; bottom: -18px; white-space: nowrap; background: rgba(15, 23, 42, 0.9); color: #f8fafc; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); pointer-events: none; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">
              ${text}
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
    };

    // 3. Add Origin Marker
    if (origin && origin.lat && origin.lng) {
      const originMarker = L.marker([origin.lat, origin.lng], {
        icon: createHtmlIcon('#16a34a', origin.name.split(',')[0], 'START')
      }).addTo(markerGroup);

      originMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #16a34a;">Origin Departure Point</strong><br/>
          <b>${origin.name}</b><br/>
          <span style="color: #64748b; font-size: 10px;">Coordinates: ${origin.lat.toFixed(4)}° N, ${origin.lng.toFixed(4)}° E</span>
        </div>
      `);
      bounds.extend([origin.lat, origin.lng]);
    }

    // 4. Add Destination Marker
    if (destination && destination.lat && destination.lng) {
      const destMarker = L.marker([destination.lat, destination.lng], {
        icon: createHtmlIcon('#ea580c', destination.name.split(',')[0], 'END')
      }).addTo(markerGroup);

      destMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #ea580c;">Destination Arrival Point</strong><br/>
          <b>${destination.name}</b><br/>
          <span style="color: #64748b; font-size: 10px;">Coordinates: ${destination.lat.toFixed(4)}° N, ${destination.lng.toFixed(4)}° E</span>
        </div>
      `);
      bounds.extend([destination.lat, destination.lng]);
    }

    // 5. Add User GPS Location Pulse Marker if present
    if (userGpsLocation && userGpsLocation.lat && userGpsLocation.lng) {
      const gpsIcon = L.divIcon({
        className: 'gps-live-marker',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: -8px; border-radius: 50%; background: #0284c7; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 24px; height: 24px; border-radius: 50%; background: #0284c7; border: 3px solid white; box-shadow: 0 0 10px rgba(2,132,199,0.8);"></div>
            <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: #0f172a; color: #38bdf8; font-size: 9px; font-weight: bold; padding: 1px 5px; border-radius: 4px; border: 1px solid #38bdf8;">
              LIVE GPS
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([userGpsLocation.lat, userGpsLocation.lng], { icon: gpsIcon })
        .addTo(markerGroup)
        .bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px;">
            <strong style="color: #0284c7;">📍 Your Live Device Position</strong><br/>
            <span>${userGpsLocation.name}</span>
          </div>
        `);

      bounds.extend([userGpsLocation.lat, userGpsLocation.lng]);
    }

    // 6. Hazard & Ghat warning alerts on map
    if (hazardAlerts && hazardAlerts.length > 0) {
      hazardAlerts.forEach(h => {
        const warnIcon = L.divIcon({
          className: 'hazard-icon',
          html: `
            <div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
              ⚠
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([h.lat, h.lng], { icon: warnIcon })
          .addTo(markerGroup)
          .bindPopup(`<strong>Hazard Alert:</strong> ${h.title} (${h.severity})`);
      });
    }

    // Auto fit bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [origin, destination, routeGeometry, userGpsLocation, hazardAlerts]);

  // ANIMATED SIMULATION ENGINE: Moves vehicle along route coordinates
  useEffect(() => {
    if (!isSimulating || !routeGeometry || routeGeometry.coordinates.length < 2) return;

    const totalSteps = routeGeometry.coordinates.length;
    const intervalMs = Math.max(Math.round(260 / simSpeed), 40);

    const timer = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= totalSteps - 1) {
          setIsSimulating(false);
          setSimCompleted(true);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, routeGeometry, simSpeed]);

  // Update Moving Vehicle Marker and Traveled Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !routeGeometry || routeGeometry.coordinates.length < 2) return;

    const coords = routeGeometry.coordinates;
    const totalSteps = coords.length;
    const safeIdx = Math.min(Math.max(currentStepIndex, 0), totalSteps - 1);
    const curr = coords[safeIdx];
    const next = coords[Math.min(safeIdx + 1, totalSteps - 1)];

    // Calculate heading angle
    const bearing = calculateBearing(curr[0], curr[1], next[0], next[1]);
    const progressPercent = Math.round((safeIdx / (totalSteps - 1)) * 100);
    const coveredKm = Math.round((safeIdx / (totalSteps - 1)) * routeGeometry.distanceKm);
    
    // Dynamic simulated road speed (50-75 km/h with minor road variance)
    const simulatedSpeedKmh = Math.min(Math.max(55 + Math.round(Math.sin(safeIdx) * 12), 40), 85);

    // Update traveled line
    if (traveledLayerRef.current) {
      traveledLayerRef.current.setLatLngs(coords.slice(0, safeIdx + 1));
    }

    // Vehicle custom icon with directional truck and active pulse
    const vehicleIcon = L.divIcon({
      className: 'moving-vehicle-icon',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <!-- Radar beam pulse -->
          <div style="position: absolute; inset: -4px; border-radius: 50%; background: #3b82f6; opacity: 0.4; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          
          <!-- Directional Vehicle Shell with rotation -->
          <div style="transform: rotate(${Math.round(bearing)}deg); transition: transform 0.2s ease-out; background: linear-gradient(135deg, #1d4ed8, #2563eb); width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid #ffffff; box-shadow: 0 4px 16px rgba(29, 78, 216, 0.75);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18.5" r="2.5"/>
              <circle cx="7" cy="18.5" r="2.5"/>
            </svg>
          </div>

          <!-- Speed & Progress Floating Badge -->
          <div style="position: absolute; bottom: -20px; white-space: nowrap; background: #0f172a; color: #38bdf8; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.6); box-shadow: 0 2px 8px rgba(0,0,0,0.6); pointer-events: none;">
            ${progressPercent}% • ${simulatedSpeedKmh} km/h
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    if (!vehicleMarkerRef.current) {
      const marker = L.marker([curr[0], curr[1]], { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="color: #2563eb;">🚚 Active Fleet in Transit</strong><br/>
          <b>${selectedRouteName || activeRouteId || 'Selected Route Corridor'}</b><br/>
          <span>Covered: ${coveredKm} km of ${routeGeometry.distanceKm} km</span><br/>
          <span>Speed: ${simulatedSpeedKmh} km/h</span>
        </div>
      `);
      vehicleMarkerRef.current = marker;
    } else {
      vehicleMarkerRef.current.setLatLng([curr[0], curr[1]]);
      vehicleMarkerRef.current.setIcon(vehicleIcon);
    }

    // Auto-pan camera to follow vehicle along the route
    if (autoFollowCamera && isSimulating) {
      map.panTo([curr[0], curr[1]], { animate: true, duration: 0.25 });
    }
  }, [currentStepIndex, routeGeometry, isSimulating, autoFollowCamera, selectedRouteName, activeRouteId]);

  const handleFlyToGps = () => {
    if (userGpsLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userGpsLocation.lat, userGpsLocation.lng], 14, { duration: 1.5 });
    } else if (onLocateMeClick) {
      onLocateMeClick();
    }
  };

  const handlePlayPause = () => {
    if (simCompleted) {
      setCurrentStepIndex(0);
      setSimCompleted(false);
      setIsSimulating(true);
      return;
    }
    setIsSimulating(!isSimulating);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setCurrentStepIndex(0);
    setSimCompleted(false);
    if (routeGeometry && routeGeometry.coordinates.length > 0 && mapInstanceRef.current) {
      const start = routeGeometry.coordinates[0];
      mapInstanceRef.current.panTo([start[0], start[1]], { animate: true, duration: 0.5 });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!routeGeometry || routeGeometry.coordinates.length === 0) return;
    const val = parseInt(e.target.value, 10);
    const targetIdx = Math.round((val / 100) * (routeGeometry.coordinates.length - 1));
    setCurrentStepIndex(targetIdx);
    setSimCompleted(targetIdx >= routeGeometry.coordinates.length - 1);
  };

  const progressPercent = routeGeometry && routeGeometry.coordinates.length > 1
    ? Math.round((currentStepIndex / (routeGeometry.coordinates.length - 1)) * 100)
    : 0;

  const currentCoveredKm = routeGeometry
    ? Math.round((progressPercent / 100) * routeGeometry.distanceKm)
    : 0;

  const remainingKm = routeGeometry
    ? Math.max(routeGeometry.distanceKm - currentCoveredKm, 0)
    : 0;

  return (
    <div className={`relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : className}`}>
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none gap-2 flex-wrap sm:flex-nowrap">
        {/* Left Status Chip & Climate Badge */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2 shadow-lg text-white">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">
              {routeGeometry ? (
                <>
                  <span className="text-sky-400">{routeGeometry.distanceKm} km</span> • {Math.floor(routeGeometry.durationMinutes / 60)}h {routeGeometry.durationMinutes % 60}m
                  {activeRouteId && (
                    <span className="ml-1.5 text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30 font-mono font-bold">
                      {activeRouteId}
                    </span>
                  )}
                  {routeGeometry.isRealTime && <span className="ml-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">Live Highway OSRM</span>}
                </>
              ) : (
                'Pan-India GIS Street & Village Map'
              )}
            </span>
          </div>

          {climateData && (
            <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 shadow-lg text-white">
              <span className={`w-2 h-2 rounded-full ${
                climateData.riskLevel === 'Severe' ? 'bg-red-500 animate-ping' :
                climateData.riskLevel === 'High' ? 'bg-orange-400 animate-pulse' :
                climateData.riskLevel === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className="font-bold text-white">{climateData.temperature}°C</span>
              <span className="text-cyan-300 font-medium hidden md:inline text-[11px] truncate max-w-[140px]">{climateData.conditionText}</span>
              {climateData.precipitationMm > 0 && (
                <span className="text-sky-300 font-mono text-[10px] bg-sky-500/20 px-1.5 py-0.5 rounded border border-sky-500/30">
                  {climateData.precipitationMm} mm/h
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-lg text-xs">
          {/* Radar Overlay Toggle */}
          <button
            type="button"
            onClick={() => setShowWeatherRadar(!showWeatherRadar)}
            className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              showWeatherRadar
                ? 'bg-cyan-500 text-slate-950 font-bold shadow ring-1 ring-cyan-400'
                : 'text-cyan-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Live Automated Doppler Weather Radar Layer"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="text-[11px]">Radar</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

          {/* Style Toggles */}
          <button
            type="button"
            onClick={() => setMapStyle('dark')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              mapStyle === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Dark Logistics Basemap"
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              mapStyle === 'streets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="OpenStreetMap Street View"
          >
            Streets
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('topo')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              mapStyle === 'topo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Topographic Terrain & Ghats"
          >
            Terrain
          </button>

          <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

          {/* GPS Locate Me Button */}
          <button
            type="button"
            onClick={handleFlyToGps}
            disabled={isLocating}
            className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-all cursor-pointer ${
              userGpsLocation
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="Locate My Live GPS Position"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline text-[11px]">
              {isLocating ? 'Locating...' : 'My Location'}
            </span>
          </button>

          {/* Toggle Turn-by-Turn Panel */}
          {routeGeometry && routeGeometry.instructions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowInstructions(!showInstructions)}
              className={`p-1.5 rounded-lg flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                showInstructions ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Turn-by-turn Navigation Steps"
            >
              <Milestone className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Turns</span>
            </button>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[440px] md:min-h-[540px] z-0" 
      />

      {/* Slide-out Turn-by-Turn Navigation Instructions */}
      {showInstructions && routeGeometry && (
        <div className="absolute top-16 right-3 w-80 max-h-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 z-[400] text-white flex flex-col animate-in slide-in-from-right">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
            <div className="flex items-center gap-1.5">
              <Milestone className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-xs">Turn-by-Turn Route Guidance</span>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto space-y-2 text-xs flex-1 pr-1">
            {routeGeometry.instructions.map((step, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{step.text}</p>
                  <p className="text-[10px] text-slate-400">In ~{(step.distanceM / 1000).toFixed(1)} km</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INTERACTIVE ROUTE-FOLLOWING CONTROLLER DOCK (Follow Selected Route Live) */}
      {routeGeometry && routeGeometry.coordinates.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3 shadow-2xl text-white space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayPause}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isSimulating
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400/40'
                    : simCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/30'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Route</span>
                  </>
                ) : simCompleted ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay Journey</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Follow Route Live</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetSimulation}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs cursor-pointer"
                title="Reset to Origin"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Multiplier Controls */}
              <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-[11px] font-mono">
                {[1, 2, 5, 10].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setSimSpeed(speed)}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      simSpeed === speed
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Auto Follow Camera Toggle */}
              <button
                type="button"
                onClick={() => setAutoFollowCamera(!autoFollowCamera)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                  autoFollowCamera
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Automatically pan camera to follow moving vehicle"
              >
                <Video className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">
                  {autoFollowCamera ? 'Auto-Pan On' : 'Auto-Pan Off'}
                </span>
              </button>
            </div>

            {/* Live Progress Numbers */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Covered: <strong className="text-white font-mono">{currentCoveredKm} km</strong> ({progressPercent}%)
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-slate-400">
                <span>Remaining: <strong className="text-slate-200 font-mono">{remainingKm} km</strong></span>
              </div>
              {simCompleted && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold animate-pulse">
                  🏁 Destination Reached
                </span>
              )}
            </div>
          </div>

          {/* Scrubbing Range Slider for Interactive Scrubber */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercent}
                onChange={handleSliderChange}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span className="truncate max-w-[45%] text-emerald-400 font-semibold">
                ▲ {origin?.name ? origin.name.split(',')[0] : 'Origin'}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {activeRouteId ? `Tracking: ${activeRouteId}` : 'Selected Road Corridor'}
              </span>
              <span className="truncate max-w-[45%] text-orange-400 font-semibold text-right">
                ▼ {destination?.name ? destination.name.split(',')[0] : 'Destination'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

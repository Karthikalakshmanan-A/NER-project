import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Crosshair, 
  Search, 
  Loader2, 
  Check, 
  X, 
  Building2, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { 
  searchAnyIndiaLocation, 
  getCurrentDeviceLocation, 
  GeoLocationResult 
} from '../utils/indiaGeoService';
import { findLocationByNameOrId, INDIA_LOCATIONS } from '../data/indiaLocations';

interface IndiaLocationSearchInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (locationName: string, geoData?: GeoLocationResult) => void;
  isOrigin?: boolean;
  onGpsAcquired?: (loc: GeoLocationResult) => void;
  className?: string;
}

export const IndiaLocationSearchInput: React.FC<IndiaLocationSearchInputProps> = ({
  label,
  placeholder = 'Search village, city, district in India...',
  value,
  onChange,
  isOrigin = false,
  onGpsAcquired,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchAnyIndiaLocation(val);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelect = (item: GeoLocationResult) => {
    setInputValue(item.name);
    onChange(item.name, item);
    setIsOpen(false);
  };

  const handleUseGps = async () => {
    setIsLocating(true);
    setGpsError(null);
    try {
      const loc = await getCurrentDeviceLocation();
      setInputValue(loc.name);
      onChange(loc.name, loc);
      if (onGpsAcquired) onGpsAcquired(loc);
      setIsOpen(false);
    } catch (err: any) {
      setGpsError(err.message || 'GPS location could not be acquired.');
      setTimeout(() => setGpsError(null), 5000);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MapPin className={`w-3.5 h-3.5 ${isOrigin ? 'text-emerald-500' : 'text-orange-500'}`} />
          {label}
        </label>

        {isOrigin && (
          <button
            type="button"
            onClick={handleUseGps}
            disabled={isLocating}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800"
            title="Use current GPS device location"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                <span>Locating GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3 h-3 text-blue-500" />
                <span>📍 My Current Location</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Input wrapper */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />

        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />

        {isLoading && (
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin absolute right-3 top-3 pointer-events-none" />
        )}

        {inputValue && !isLoading && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* GPS Error notice */}
      {gpsError && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg border border-amber-200 dark:border-amber-800 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in-50">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>India Places, Districts &amp; Villages ({suggestions.length})</span>
            <span>OSM &amp; Logistics Index</span>
          </div>

          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-2.5 cursor-pointer group"
            >
              <div className="mt-0.5 p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                {item.type === 'village' ? (
                  <Compass className="w-3.5 h-3.5" />
                ) : (
                  <Building2 className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                    {item.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.displayName}
                </p>
              </div>
              {inputValue.toLowerCase() === item.name.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 self-center" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  MapPin,
  Sparkles,
  CloudSun,
  Compass,
} from 'lucide-react';
import { LocationItem, TemperatureUnit, WeatherReport } from './types/weather';
import {
  DEFAULT_LOCATIONS,
  fetchWeatherReport,
  reverseGeocode,
} from './services/weatherApi';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { WeatherTips } from './components/WeatherTips';

const STORAGE_KEYS = {
  LOCATION: 'weather_check_last_location',
  FAVORITES: 'weather_check_favorites',
  UNIT: 'weather_check_unit',
};

export default function App() {
  // State
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_LOCATIONS[0]; // London default
  });

  const [favorites, setFavorites] = useState<LocationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [DEFAULT_LOCATIONS[0], DEFAULT_LOCATIONS[1], DEFAULT_LOCATIONS[2]]; // London, NY, Tokyo
  });

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNIT);
      if (saved === 'celsius' || saved === 'fahrenheit') return saved;
    } catch (e) {
      console.warn(e);
    }
    return 'celsius';
  });

  const [report, setReport] = useState<WeatherReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Load weather data
  const loadWeather = useCallback(async (loc: LocationItem, showRefreshSpinner = false) => {
    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherReport(loc);
      setReport(data);
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(loc));
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(err?.message || 'Unable to retrieve meteorological data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load or location change
  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation, loadWeather]);

  // Save unit
  const handleToggleUnit = () => {
    const nextUnit: TemperatureUnit = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(nextUnit);
    localStorage.setItem(STORAGE_KEYS.UNIT, nextUnit);
  };

  // Toggle favorite
  const handleToggleFavorite = (loc: LocationItem) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.latitude === loc.latitude && f.longitude === loc.longitude
      );
      let updated: LocationItem[];
      if (exists) {
        updated = prev.filter(
          (f) => !(f.latitude === loc.latitude && f.longitude === loc.longitude)
        );
      } else {
        updated = [...prev, loc];
      }
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    });
  };

  // GPS Location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      setTimeout(() => setGeoNotice(null), 4000);
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const detectedLoc = await reverseGeocode(lat, lon);
          setSelectedLocation(detectedLoc);
        } catch (err) {
          console.error(err);
          setGeoNotice('Could not reverse geocode your location.');
          setTimeout(() => setGeoNotice(null), 4000);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        let msg = 'Could not access device location.';
        if (err.code === 1) msg = 'Location permission was denied. Please select a city manually.';
        else if (err.code === 2) msg = 'Location is unavailable right now.';
        else if (err.code === 3) msg = 'Location request timed out.';
        setGeoNotice(msg);
        setTimeout(() => setGeoNotice(null), 4500);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingGps}
        onRefresh={() => loadWeather(selectedLocation, true)}
        isRefreshing={isRefreshing}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Geolocation Toast Notice */}
      {geoNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-3">
          <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-2xl text-amber-300 text-xs flex items-center justify-between shadow-md">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              {geoNotice}
            </span>
            <button
              onClick={() => setGeoNotice(null)}
              className="text-amber-400 hover:text-amber-200 font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Bento Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Error Display */}
        {error && (
          <div className="p-8 bg-rose-950/40 border border-rose-800/80 rounded-3xl text-center space-y-3 shadow-md">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-rose-200">
              Weather Data Unavailable
            </h3>
            <p className="text-sm text-rose-300 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => loadWeather(selectedLocation)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-2 shadow-md shadow-rose-900/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !report && (
          <div className="space-y-6 animate-pulse">
            <div className="h-72 bg-slate-900/60 border border-slate-800 rounded-3xl" />
            <div className="h-40 bg-slate-900/60 border border-slate-800 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-900/60 border border-slate-800 rounded-3xl" />
              ))}
            </div>
          </div>
        )}

        {/* Loaded Weather Dashboard */}
        {report && (
          <>
            {/* 1. Main Current Weather Hero */}
            <CurrentWeather report={report} unit={unit} />

            {/* 2. 24-Hour Forecast Strip */}
            <HourlyForecast hourly={report.hourly} unit={unit} />

            {/* 3. Daily Outlook & Tips in Responsive Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <DailyForecast daily={report.daily} unit={unit} />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <WeatherTips report={report} unit={unit} />
              </div>
            </div>

            {/* 4. Atmospheric Metrics Bento Grid */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 px-1">
                <div className="p-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
                  Atmospheric Conditions
                </h3>
              </div>
              <WeatherMetricsGrid report={report} unit={unit} />
            </div>
          </>
        )}

      </main>

      {/* Clean Bento Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-5 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">Weather Check</span>
            <span className="text-slate-600">•</span>
            <span>Real-time Open-Meteo High-Resolution Forecasting</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Global Coordinates</span>
            <span>•</span>
            <span>24h Strip</span>
            <span>•</span>
            <span>Air Quality Index</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


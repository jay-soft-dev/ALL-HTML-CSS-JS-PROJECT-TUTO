import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, RefreshCw, Star, X, Check, Loader2 } from 'lucide-react';
import { LocationItem, TemperatureUnit } from '../types/weather';
import { searchLocations, DEFAULT_LOCATIONS } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: LocationItem | null;
  onSelectLocation: (loc: LocationItem) => void;
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  favorites: LocationItem[];
  onToggleFavorite: (loc: LocationItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onDetectLocation,
  isDetectingLocation,
  onRefresh,
  isRefreshing,
  unit,
  onToggleUnit,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location: LocationItem) => {
    onSelectLocation(location);
    setSearchQuery('');
    setIsOpen(false);
  };

  const isCurrentFavorite = currentLocation
    ? favorites.some((f) => f.latitude === currentLocation.latitude && f.longitude === currentLocation.longitude)
    : false;

  return (
    <header id="app-header" className="w-full bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand / Logo & Location Title */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Navigation className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                  Weather Check
                </h1>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                  Bento Grid
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live atmospheric intelligence
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-unit-toggle"
              onClick={onToggleUnit}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
              title="Toggle Celsius / Fahrenheit"
            >
              {unit === 'celsius' ? '°C' : '°F'}
            </button>
            <button
              id="mobile-refresh-btn"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search Bar with autocomplete */}
        <div ref={searchContainerRef} className="relative w-full md:max-w-md">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
            <input
              id="location-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search global city or region..."
              className="w-full pl-10 pr-20 py-2.5 text-sm bg-slate-900/80 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-100 placeholder-slate-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-10 text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id="gps-location-btn"
              onClick={onDetectLocation}
              disabled={isDetectingLocation}
              className="absolute right-1.5 p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition disabled:opacity-50"
              title="Use current GPS location"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div
              id="search-dropdown-results"
              className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto"
            >
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  Searching global locations...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-1">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Search Results
                  </div>
                  {searchResults.map((item) => (
                    <button
                      key={`${item.latitude}-${item.longitude}-${item.name}`}
                      onClick={() => handleSelect(item)}
                      className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-800/80 transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition" />
                        <div>
                          <p className="text-sm font-medium text-slate-200">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                      {currentLocation && currentLocation.latitude === item.latitude && currentLocation.longitude === item.longitude && (
                        <Check className="w-4 h-4 text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim().length >= 2 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No locations found for "{searchQuery}"
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Popular Global Cities
                  </div>
                  {DEFAULT_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => handleSelect(loc)}
                      className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-800/80 transition text-sm text-slate-300"
                    >
                      <span>{loc.name}, <span className="text-slate-400 text-xs">{loc.country}</span></span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Favorite Toggle for Current Location */}
          {currentLocation && (
            <button
              id="favorite-toggle-btn"
              onClick={() => onToggleFavorite(currentLocation)}
              className={`p-2.5 rounded-2xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                isCurrentFavorite
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              title={isCurrentFavorite ? 'Remove from saved locations' : 'Save location to favorites'}
            >
              <Star className={`w-4 h-4 ${isCurrentFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden lg:inline">{isCurrentFavorite ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {/* Unit Toggle */}
          <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            <button
              id="unit-celsius-btn"
              onClick={() => unit !== 'celsius' && onToggleUnit()}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                unit === 'celsius'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              onClick={() => unit !== 'fahrenheit' && onToggleUnit()}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                unit === 'fahrenheit'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-indigo-400 transition disabled:opacity-50"
            title="Refresh current weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

      </div>

      {/* Quick Favorite Cities Strip */}
      {favorites.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-0.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mr-1 shrink-0">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Favorites:
          </span>
          {favorites.map((fav) => {
            const isSelected = currentLocation?.latitude === fav.latitude && currentLocation?.longitude === fav.longitude;
            return (
              <button
                key={`${fav.latitude}-${fav.longitude}`}
                onClick={() => onSelectLocation(fav)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 border border-indigo-500/50'
                    : 'bg-slate-900/70 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {fav.name}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};


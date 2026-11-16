import React from 'react';
import {
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { WeatherReport, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  getWeatherDetails,
  formatTemperature,
  formatSpeed,
  getWindDirectionLabel,
} from '../utils/weatherCodes';

interface CurrentWeatherProps {
  report: WeatherReport;
  unit: TemperatureUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ report, unit }) => {
  const { location, current, daily, airQuality, lastUpdated } = report;
  const weatherDetails = getWeatherDetails(current.weatherCode, current.isDay);
  const todayForecast = daily[0];

  // Dynamic gradient accents tailored to weather conditions, with Bento indigo-blue as default
  const getAtmosphereGradient = () => {
    if (!current.isDay) {
      return 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-900/40 shadow-indigo-950/50';
    }
    switch (weatherDetails.category) {
      case 'clear':
        return 'from-indigo-600 via-blue-600 to-indigo-800 border-indigo-500/30 shadow-indigo-900/30';
      case 'rain':
      case 'drizzle':
      case 'thunderstorm':
        return 'from-slate-800 via-blue-900 to-indigo-950 border-blue-700/40 shadow-blue-950/40';
      case 'snow':
        return 'from-slate-800 via-sky-900 to-indigo-900 border-cyan-700/40 shadow-sky-950/40';
      default:
        return 'from-indigo-600 to-blue-700 border-indigo-500/30 shadow-indigo-900/20';
    }
  };

  const gradientClass = getAtmosphereGradient();

  return (
    <div
      id="current-weather-hero"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} text-white border p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300`}
    >
      {/* Sun/Atmosphere Glow Backdrop Orb */}
      <div className="w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-25 absolute -right-6 -top-6 pointer-events-none" />
      <div className="w-48 h-48 bg-indigo-400 rounded-full blur-3xl opacity-20 absolute -left-10 -bottom-10 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Top bar: Location & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {location.name}
                </h2>
                {location.countryCode && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-white/15 border border-white/15 uppercase tracking-wider text-white">
                    {location.countryCode}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-white/70 font-medium">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/80 self-start sm:self-auto bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>

        {/* Center: Hero Temperature & Visual Icon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-2">
          <div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest">
              Current Temperature
            </p>
            <div className="flex items-baseline mt-1">
              <span className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tight leading-none text-white">
                {formatTemperature(current.temperature, unit).replace('°', '')}°
              </span>
              <span className="text-2xl sm:text-3xl font-light text-white/60 ml-2">
                {unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/90 font-medium mt-2 max-w-md">
              {weatherDetails.description}
            </p>
          </div>

          {/* Condition Icon & Label */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={36} />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {weatherDetails.label}
                </p>
                <p className="text-xs text-white/70">
                  {todayForecast?.precipitationProbabilityMax ?? 0}% precipitation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bento Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 border border-white/10">
            <p className="text-[11px] text-white/60 uppercase tracking-widest font-bold">High</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {todayForecast ? formatTemperature(todayForecast.maxTemp, unit) : '--'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 border border-white/10">
            <p className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Low</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {todayForecast ? formatTemperature(todayForecast.minTemp, unit) : '--'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 border border-white/10">
            <p className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Feels Like</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {formatTemperature(current.apparentTemperature, unit)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3 border border-white/10">
            <p className="text-[11px] text-white/60 uppercase tracking-widest font-bold">Wind</p>
            <p className="text-lg font-bold text-white mt-0.5">
              {formatSpeed(current.windSpeed, unit)}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};


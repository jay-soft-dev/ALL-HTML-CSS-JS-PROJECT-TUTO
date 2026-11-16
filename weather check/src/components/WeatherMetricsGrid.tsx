import React from 'react';
import {
  Wind,
  Sun,
  Eye,
  Gauge,
  Droplets,
  Sunrise,
  Sunset,
  ShieldCheck,
  Navigation,
  CloudRain,
} from 'lucide-react';
import { WeatherReport, TemperatureUnit } from '../types/weather';
import {
  getUvCategory,
  getAirQualityStatus,
  formatSpeed,
  formatTemperature,
  getWindDirectionLabel,
  formatPrecipitation,
} from '../utils/weatherCodes';

interface WeatherMetricsGridProps {
  report: WeatherReport;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ report, unit }) => {
  const { current, daily, airQuality } = report;
  const todayForecast = daily[0];

  const uvInfo = getUvCategory(current.uvIndex);
  const aqiInfo = airQuality ? getAirQualityStatus(airQuality.aqiUs) : null;

  return (
    <div id="weather-metrics-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {/* 1. Air Quality Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
        <div>
          <h3 className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
            Air Quality
          </h3>
          <p className="text-4xl font-bold text-white">
            {airQuality?.aqiUs ?? 32}
          </p>
          <p className="text-emerald-400 font-medium mt-1">
            {aqiInfo?.status || 'Good'}
          </p>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(((airQuality?.aqiUs ?? 32) / 300) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            {aqiInfo?.advice || 'Air quality is considered satisfactory, and air pollution poses little or no risk.'}
          </p>
        </div>
      </div>

      {/* 2. UV Index Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
        <div>
          <h3 className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
            UV Index
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{current.uvIndex.toFixed(1)}</p>
            <span className="text-xs text-slate-500 font-medium">/ 11+</span>
          </div>
          <p className="text-amber-400 font-medium mt-1">{uvInfo.label}</p>
          
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min((current.uvIndex / 12) * 100, 100)}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          {uvInfo.advice}
        </p>
      </div>

      {/* 3. Humidity & Dew Point */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
        <div>
          <h3 className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
            Humidity
          </h3>
          <p className="text-3xl font-bold text-white">{current.relativeHumidity}%</p>
          <p className="text-slate-400 font-medium mt-1">
            The dew point is {formatTemperature(current.dewPoint, unit)}
          </p>

          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${current.relativeHumidity}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
          Cloud cover is currently {current.cloudCover}%.
        </p>
      </div>

      {/* 4. Wind Compass Bento Card */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
        <h3 className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
          Wind Direction
        </h3>

        <div className="relative h-28 flex items-center justify-center my-1">
          <div className="absolute w-24 h-24 border border-slate-800 rounded-full" />
          <div className="absolute w-16 h-16 border border-slate-800 rounded-full" />
          <div
            className="absolute w-1 h-16 bg-indigo-500 rounded-full origin-bottom mb-16 transition-transform duration-700 ease-out"
            style={{ transform: `rotate(${current.windDirection}deg)` }}
          />
          <p className="text-2xl font-bold text-white z-10">
            {formatSpeed(current.windSpeed, unit).split(' ')[0]}{' '}
            <span className="text-xs text-slate-400 font-normal">
              {unit === 'fahrenheit' ? 'mph' : 'km/h'}
            </span>
          </p>
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-400 font-mono uppercase tracking-widest px-2">
          <span>N</span>
          <span>E</span>
          <span>S</span>
          <span>W</span>
        </div>
      </div>

      {/* 5. Sunrise & Sunset Solar Timeline */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
        <h3 className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          Sun Schedule
        </h3>

        <div className="grid grid-cols-2 gap-4 my-2">
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Sunrise</p>
              <p className="text-sm font-bold text-white mt-0.5">{todayForecast?.sunrise || '--'}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Sunset</p>
              <p className="text-sm font-bold text-white mt-0.5">{todayForecast?.sunset || '--'}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {current.isDay ? 'Currently in daylight hours.' : 'Currently nighttime.'}
        </p>
      </div>

      {/* 6. Pressure, Visibility & Rainfall Summary Strip */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
        <h3 className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          Atmospheric Stats
        </h3>

        <div className="space-y-3 my-1">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pressure</span>
            <span className="text-sm font-bold text-white">{current.pressure} hPa</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Visibility</span>
            <span className="text-sm font-bold text-white">
              {unit === 'fahrenheit' ? `${Math.round(current.visibility * 0.621371)} mi` : `${current.visibility} km`}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Rainfall</span>
            <span className="text-sm font-bold text-white">
              {formatPrecipitation(todayForecast?.precipitationSum ?? 0, unit)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Real-time sensor telemetry.
        </p>
      </div>

    </div>
  );
};

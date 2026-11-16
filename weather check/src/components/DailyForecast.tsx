import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherDetails, formatTemperature } from '../utils/weatherCodes';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, unit }) => {
  if (!daily || daily.length === 0) return null;

  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const overallMin = Math.min(...allMins);
  const overallMax = Math.max(...allMaxs);
  const totalRange = Math.max(overallMax - overallMin, 1);

  return (
    <div id="daily-forecast-card" className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-md h-full flex flex-col justify-between">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Calendar className="w-4 h-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
          7-Day Forecast
        </h3>
      </div>

      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {daily.map((day, idx) => {
          const isToday = idx === 0;
          const condition = getWeatherDetails(day.weatherCode, true);

          const leftPercent = ((day.minTemp - overallMin) / totalRange) * 100;
          const widthPercent = Math.max(((day.maxTemp - day.minTemp) / totalRange) * 100, 6);

          return (
            <div
              key={day.date}
              className={`p-3 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isToday
                  ? 'bg-indigo-600/15 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Day & Condition info */}
              <div className="flex items-center justify-between sm:justify-start gap-3 sm:w-44">
                <div className="w-16">
                  <p className={`text-sm font-bold ${isToday ? 'text-indigo-400' : 'text-white'}`}>
                    {day.displayDay}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">{day.displayDate}</p>
                </div>

                <div className="flex items-center gap-2">
                  <WeatherIcon code={day.weatherCode} size={22} />
                  <span className="text-xs font-medium text-slate-300 hidden md:inline truncate max-w-[90px]">
                    {condition.label}
                  </span>
                </div>
              </div>

              {/* Precipitation chance */}
              <div className="flex items-center gap-1.5 w-16 text-xs">
                {day.precipitationProbabilityMax > 0 ? (
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    {day.precipitationProbabilityMax}%
                  </span>
                ) : (
                  <span className="text-slate-600 font-medium">--</span>
                )}
              </div>

              {/* Temperature Bar */}
              <div className="flex items-center gap-3 flex-1 sm:max-w-xs w-full">
                <span className="text-xs font-semibold text-slate-400 w-8 text-right">
                  {formatTemperature(day.minTemp, unit)}
                </span>

                <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-amber-400"
                    style={{
                      left: `${Math.max(0, Math.min(94, leftPercent))}%`,
                      width: `${Math.max(6, Math.min(100 - leftPercent, widthPercent))}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8">
                  {formatTemperature(day.maxTemp, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


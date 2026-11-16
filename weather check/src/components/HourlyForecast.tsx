import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Umbrella } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '../utils/weatherCodes';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <div id="hourly-forecast-card" className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
            Hourly Forecast
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x"
      >
        {hourly.map((item, index) => {
          const isCurrentHour = index === 0;
          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between min-w-[82px] py-4 px-3 rounded-2xl border transition shrink-0 snap-start text-center ${
                isCurrentHour
                  ? 'bg-indigo-600/20 border-indigo-500/50 shadow-md shadow-indigo-900/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              {/* Hour */}
              <span className={`text-xs font-semibold ${isCurrentHour ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                {item.displayTime}
              </span>

              {/* Weather Icon */}
              <div className="my-3">
                <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={28} />
              </div>

              {/* Temp */}
              <span className="text-base font-bold text-white">
                {formatTemperature(item.temperature, unit)}
              </span>

              {/* Rain chance pill */}
              <div className="mt-2 min-h-[20px] flex items-center justify-center">
                {item.precipitationProbability > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded-full">
                    <Umbrella className="w-2.5 h-2.5" />
                    {item.precipitationProbability}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-600 font-medium">0%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


import React from 'react';
import {
  Sparkles,
  Umbrella,
  Shirt,
  Sun,
  Activity,
  HeartHandshake,
} from 'lucide-react';
import { WeatherReport, TemperatureUnit } from '../types/weather';
import { formatTemperature } from '../utils/weatherCodes';

interface WeatherTipsProps {
  report: WeatherReport;
  unit: TemperatureUnit;
}

export const WeatherTips: React.FC<WeatherTipsProps> = ({ report, unit }) => {
  const { current, daily, airQuality } = report;
  const today = daily[0];

  const tips: Array<{ icon: any; title: string; desc: string; tone: string; badge: string }> = [];

  // 1. Rain / Umbrella Check
  const rainChance = today?.precipitationProbabilityMax ?? 0;
  if (rainChance >= 50 || current.precipitation > 0) {
    tips.push({
      icon: Umbrella,
      title: 'Carry an Umbrella',
      desc: `High probability of precipitation (${rainChance}%). Keep rain gear handy when leaving.`,
      tone: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      badge: 'Rain Alert',
    });
  }

  // 2. Clothing & Layer Advice
  if (current.temperature < 5) {
    tips.push({
      icon: Shirt,
      title: 'Heavy Winter Layers',
      desc: 'Freezing temperatures. Wear a thermal base layer, insulated coat, gloves, and a beanie.',
      tone: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
      badge: 'Cold Weather',
    });
  } else if (current.temperature < 15) {
    tips.push({
      icon: Shirt,
      title: 'Light Jacket or Sweater',
      desc: 'Cool conditions. A comfortable jacket, cardigan, or hoodie is recommended.',
      tone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      badge: 'Mild Cool',
    });
  } else if (current.temperature > 28) {
    tips.push({
      icon: Shirt,
      title: 'Light & Breathable Clothing',
      desc: 'Warm temperatures. Choose loose-fitting cotton or linen fabrics and stay well hydrated.',
      tone: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      badge: 'Warm Weather',
    });
  } else {
    tips.push({
      icon: Shirt,
      title: 'Comfortable Daily Attire',
      desc: 'Pleasant room-like atmospheric temperature. Standard casual attire is ideal.',
      tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      badge: 'Comfortable',
    });
  }

  // 3. UV & Sun Protection
  if (current.uvIndex >= 6) {
    tips.push({
      icon: Sun,
      title: 'Sun Protection Required',
      desc: `High UV index (${current.uvIndex.toFixed(1)}). Apply SPF 30+ sunscreen and wear UV-rated sunglasses.`,
      tone: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      badge: 'UV Warning',
    });
  }

  // 4. Outdoor Activity & Fitness
  const isGreatForRun = current.temperature >= 12 && current.temperature <= 22 && rainChance < 30 && current.windSpeed < 25;
  if (isGreatForRun) {
    tips.push({
      icon: Activity,
      title: 'Prime Outdoor Conditions',
      desc: 'Great atmospheric balance for cycling, running, walking, or sports activities.',
      tone: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      badge: 'Outdoor Ready',
    });
  } else if (airQuality && airQuality.aqiUs > 100) {
    tips.push({
      icon: HeartHandshake,
      title: 'Sensitive Health Caution',
      desc: `Air quality AQI is ${airQuality.aqiUs}. Sensitive individuals should limit heavy exertion outside.`,
      tone: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      badge: 'Air Caution',
    });
  }

  return (
    <div id="weather-insights-card" className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-md">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
          Daily Insights & Recommendations
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between gap-3 transition"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                  {tip.badge}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{tip.title}</h4>
                <p className="text-xs mt-1 text-slate-400 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export interface WeatherCodeDetails {
  label: string;
  description: string;
  icon: string; // Key corresponding to Lucide icon component
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export const WMO_WEATHER_CODES: Record<number, WeatherCodeDetails> = {
  0: {
    label: 'Clear Sky',
    description: 'Completely clear sky with abundant sunshine',
    icon: 'Sun',
    category: 'clear',
  },
  1: {
    label: 'Mainly Clear',
    description: 'Mostly clear skies with a few passing clouds',
    icon: 'SunDim',
    category: 'clear',
  },
  2: {
    label: 'Partly Cloudy',
    description: 'Scattered clouds with intermittent sunshine',
    icon: 'CloudSun',
    category: 'cloudy',
  },
  3: {
    label: 'Overcast',
    description: 'Dense cloud cover blocking direct sunlight',
    icon: 'Cloud',
    category: 'cloudy',
  },
  45: {
    label: 'Foggy',
    description: 'Thick fog reducing horizontal visibility',
    icon: 'CloudFog',
    category: 'fog',
  },
  48: {
    label: 'Depositing Rime Fog',
    description: 'Freezing fog forming frost on surfaces',
    icon: 'CloudFog',
    category: 'fog',
  },
  51: {
    label: 'Light Drizzle',
    description: 'Gentle mist-like light precipitation',
    icon: 'CloudDrizzle',
    category: 'drizzle',
  },
  53: {
    label: 'Moderate Drizzle',
    description: 'Steady light drizzle droplets',
    icon: 'CloudDrizzle',
    category: 'drizzle',
  },
  55: {
    label: 'Dense Drizzle',
    description: 'Heavy drizzle with reduced visibility',
    icon: 'CloudDrizzle',
    category: 'drizzle',
  },
  56: {
    label: 'Light Freezing Drizzle',
    description: 'Freezing drizzle forming a thin ice glaze',
    icon: 'CloudSnow',
    category: 'drizzle',
  },
  57: {
    label: 'Dense Freezing Drizzle',
    description: 'Heavy freezing drizzle causing icy surfaces',
    icon: 'CloudSnow',
    category: 'drizzle',
  },
  61: {
    label: 'Slight Rain',
    description: 'Light continuous rain showers',
    icon: 'CloudRain',
    category: 'rain',
  },
  63: {
    label: 'Moderate Rain',
    description: 'Consistent moderate rainfall',
    icon: 'CloudRain',
    category: 'rain',
  },
  65: {
    label: 'Heavy Rain',
    description: 'Intense, heavy rain showers',
    icon: 'CloudRain',
    category: 'rain',
  },
  66: {
    label: 'Light Freezing Rain',
    description: 'Sub-zero raindrops freezing on contact',
    icon: 'CloudSnow',
    category: 'rain',
  },
  67: {
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing rain creating icy hazards',
    icon: 'CloudSnow',
    category: 'rain',
  },
  71: {
    label: 'Slight Snowfall',
    description: 'Flurries and light snowfall',
    icon: 'Snowflake',
    category: 'snow',
  },
  73: {
    label: 'Moderate Snowfall',
    description: 'Steady accumulating snowfall',
    icon: 'Snowflake',
    category: 'snow',
  },
  75: {
    label: 'Heavy Snowfall',
    description: 'Rapidly accumulating heavy snow',
    icon: 'Snowflake',
    category: 'snow',
  },
  77: {
    label: 'Snow Grains',
    description: 'Fine frozen crystalline snow grains',
    icon: 'Snowflake',
    category: 'snow',
  },
  80: {
    label: 'Slight Rain Showers',
    description: 'Brief and scattered rain showers',
    icon: 'CloudRain',
    category: 'rain',
  },
  81: {
    label: 'Moderate Rain Showers',
    description: 'Frequent rain showers',
    icon: 'CloudRain',
    category: 'rain',
  },
  82: {
    label: 'Violent Rain Showers',
    description: 'Torrential downpours and burst showers',
    icon: 'CloudLightning',
    category: 'rain',
  },
  85: {
    label: 'Slight Snow Showers',
    description: 'Intermittent snow shower squalls',
    icon: 'Snowflake',
    category: 'snow',
  },
  86: {
    label: 'Heavy Snow Showers',
    description: 'Intense snow squalls with rapid accumulation',
    icon: 'Snowflake',
    category: 'snow',
  },
  95: {
    label: 'Thunderstorm',
    description: 'Thunderstorm activity with lightning',
    icon: 'CloudLightning',
    category: 'thunderstorm',
  },
  96: {
    label: 'Thunderstorm with Slight Hail',
    description: 'Electrical storm with small hail pellets',
    icon: 'CloudLightning',
    category: 'thunderstorm',
  },
  99: {
    label: 'Thunderstorm with Heavy Hail',
    description: 'Severe thunderstorm producing damaging hail',
    icon: 'CloudLightning',
    category: 'thunderstorm',
  },
};

export function getWeatherDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  const details = WMO_WEATHER_CODES[code] || {
    label: 'Clear',
    description: 'Normal seasonal atmospheric conditions',
    icon: isDay ? 'Sun' : 'Moon',
    category: 'clear',
  };

  // Adjust icon for nighttime clear/cloudy conditions
  if (!isDay) {
    if (code === 0) return { ...details, icon: 'Moon' };
    if (code === 1 || code === 2) return { ...details, icon: 'CloudMoon' };
  }

  return details;
}

export function getAirQualityStatus(aqi: number): {
  status: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  badgeBg: string;
  advice: string;
} {
  if (aqi <= 50) {
    return {
      status: 'Good',
      color: 'text-emerald-700 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      advice: 'Air quality is satisfactory. Perfect conditions for outdoor activities.',
    };
  } else if (aqi <= 100) {
    return {
      status: 'Moderate',
      color: 'text-amber-700 dark:text-amber-400',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      advice: 'Air quality is acceptable; unusually sensitive individuals should consider limiting prolonged outdoor exertion.',
    };
  } else if (aqi <= 150) {
    return {
      status: 'Unhealthy for Sensitive Groups',
      color: 'text-orange-700 dark:text-orange-400',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
      advice: 'Members of sensitive groups may experience health effects. General public is less likely affected.',
    };
  } else if (aqi <= 200) {
    return {
      status: 'Unhealthy',
      color: 'text-rose-700 dark:text-rose-400',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      advice: 'Everyone may begin to experience health effects; limit prolonged outdoor exposure.',
    };
  } else if (aqi <= 300) {
    return {
      status: 'Very Unhealthy',
      color: 'text-purple-700 dark:text-purple-400',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      advice: 'Health alert: risk of health effects is increased for everyone.',
    };
  } else {
    return {
      status: 'Hazardous',
      color: 'text-red-800 dark:text-red-400',
      badgeBg: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
      advice: 'Health warning of emergency conditions. The entire population is more likely to be affected.',
    };
  }
}

export function getUvCategory(uvIndex: number): {
  label: string;
  color: string;
  badgeBg: string;
  advice: string;
} {
  if (uvIndex < 3) {
    return {
      label: 'Low',
      color: 'text-emerald-700 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      advice: 'No protection needed. You can safely stay outside.',
    };
  } else if (uvIndex < 6) {
    return {
      label: 'Moderate',
      color: 'text-amber-700 dark:text-amber-400',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      advice: 'Wear sunglasses and SPF 30+ sunscreen during midday hours.',
    };
  } else if (uvIndex < 8) {
    return {
      label: 'High',
      color: 'text-orange-700 dark:text-orange-400',
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
      advice: 'Protection essential. Reduce time in the sun between 10 a.m. and 4 p.m.',
    };
  } else if (uvIndex < 11) {
    return {
      label: 'Very High',
      color: 'text-rose-700 dark:text-rose-400',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
      advice: 'Extra protection required. Seek shade, wear a hat and protective clothing.',
    };
  } else {
    return {
      label: 'Extreme',
      color: 'text-purple-700 dark:text-purple-400',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300',
      advice: 'Take all precautions. Unprotected skin and eyes will burn in minutes.',
    };
  }
}

export function formatTemperature(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatSpeed(kmh: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const inches = mm * 0.0393701;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg % 360) / 22.5)) % 16;
  return directions[index];
}

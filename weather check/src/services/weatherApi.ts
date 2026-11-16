import { LocationItem, WeatherReport, AirQualityData, DailyForecastItem, HourlyForecastItem } from '../types/weather';
import { getAirQualityStatus } from '../utils/weatherCodes';

export const DEFAULT_LOCATIONS: LocationItem[] = [
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', admin1: 'England', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'newyork', name: 'New York', country: 'United States', countryCode: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { id: 'sanfrancisco', name: 'San Francisco', country: 'United States', countryCode: 'US', admin1: 'California', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
];

export async function searchLocations(query: string): Promise<LocationItem[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=8&language=en&format=json`);
    if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: `${item.id || item.latitude + '_' + item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch (error) {
    console.error('Failed to search locations:', error);
    // Fallback: match default locations
    return DEFAULT_LOCATIONS.filter(l => 
      l.name.toLowerCase().includes(query.toLowerCase()) || 
      l.country.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationItem> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`, {
      headers: {
        'Accept-Language': 'en',
      }
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.county || 'Current Location';
      const country = addr.country || '';
      const admin1 = addr.state || addr.region || '';
      const countryCode = (addr.country_code || '').toUpperCase();
      return {
        id: `current_${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
        name,
        country,
        countryCode,
        admin1,
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding fallback triggered:', e);
  }

  return {
    id: `current_${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
    name: 'Current Location',
    country: '',
    latitude,
    longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}

export async function fetchWeatherReport(location: LocationItem): Promise<WeatherReport> {
  const { latitude, longitude, timezone = 'auto' } = location;

  // 1. Fetch Forecast Data
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.searchParams.set('latitude', latitude.toString());
  forecastUrl.searchParams.set('longitude', longitude.toString());
  forecastUrl.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility');
  forecastUrl.searchParams.set('hourly', 'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,uv_index,is_day');
  forecastUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max');
  forecastUrl.searchParams.set('timezone', timezone === 'auto' ? 'auto' : timezone);
  forecastUrl.searchParams.set('forecast_days', '8');

  // 2. Fetch Air Quality Data
  const airQualityUrl = new URL('https://air-quality-api.open-meteo.com/v1/air-quality');
  airQualityUrl.searchParams.set('latitude', latitude.toString());
  airQualityUrl.searchParams.set('longitude', longitude.toString());
  airQualityUrl.searchParams.set('current', 'us_aqi,pm10,pm2_5,nitrogen_dioxide,ozone,sulphur_dioxide');

  const [forecastRes, airRes] = await Promise.all([
    fetch(forecastUrl.toString()),
    fetch(airQualityUrl.toString()).catch(() => null),
  ]);

  if (!forecastRes.ok) {
    throw new Error(`Failed to load weather data: ${forecastRes.statusText}`);
  }

  const forecastData = await forecastRes.json();
  let airQualityData: AirQualityData | undefined;

  if (airRes && airRes.ok) {
    try {
      const airJson = await airRes.json();
      if (airJson.current) {
        const aqi = airJson.current.us_aqi ?? 35;
        const statusInfo = getAirQualityStatus(aqi);
        airQualityData = {
          aqiUs: Math.round(aqi),
          pm25: Number((airJson.current.pm2_5 ?? 8.5).toFixed(1)),
          pm10: Number((airJson.current.pm10 ?? 14.2).toFixed(1)),
          no2: Number((airJson.current.nitrogen_dioxide ?? 12.0).toFixed(1)),
          ozone: Number((airJson.current.ozone ?? 45.0).toFixed(1)),
          so2: Number((airJson.current.sulphur_dioxide ?? 3.0).toFixed(1)),
          status: statusInfo.status,
          color: statusInfo.color,
        };
      }
    } catch (e) {
      console.warn('Air quality parse error:', e);
    }
  }

  // Calculate dew point approximation
  const cur = forecastData.current;
  const temp = cur.temperature_2m;
  const humidity = cur.relative_humidity_2m;
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100.0);
  const dewPoint = (b * alpha) / (a - alpha);

  // Parse Hourly Forecast (next 24 hours starting from current hour)
  const currentIsoTime = cur.time;
  const hourlyTimeArray: string[] = forecastData.hourly?.time || [];
  let startIndex = hourlyTimeArray.findIndex(t => t >= currentIsoTime.slice(0, 13));
  if (startIndex === -1) startIndex = 0;

  const hourly: HourlyForecastItem[] = [];
  const next24 = hourlyTimeArray.slice(startIndex, startIndex + 24);

  next24.forEach((isoTime, i) => {
    const idx = startIndex + i;
    const dateObj = new Date(isoTime);
    const displayTime = i === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    hourly.push({
      time: isoTime,
      displayTime,
      temperature: forecastData.hourly.temperature_2m[idx] ?? 0,
      apparentTemperature: forecastData.hourly.apparent_temperature[idx] ?? 0,
      weatherCode: forecastData.hourly.weather_code[idx] ?? 0,
      precipitationProbability: forecastData.hourly.precipitation_probability[idx] ?? 0,
      windSpeed: forecastData.hourly.wind_speed_10m[idx] ?? 0,
      uvIndex: forecastData.hourly.uv_index[idx] ?? 0,
      isDay: Boolean(forecastData.hourly.is_day[idx] ?? 1),
    });
  });

  // Parse Daily Forecast (7 days)
  const daily: DailyForecastItem[] = [];
  const dailyDates: string[] = forecastData.daily?.time || [];

  dailyDates.slice(0, 7).forEach((dateStr, idx) => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const isToday = idx === 0;
    const displayDay = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    daily.push({
      date: dateStr,
      displayDay,
      displayDate,
      weatherCode: forecastData.daily.weather_code[idx] ?? 0,
      maxTemp: forecastData.daily.temperature_2m_max[idx] ?? 0,
      minTemp: forecastData.daily.temperature_2m_min[idx] ?? 0,
      precipitationProbabilityMax: forecastData.daily.precipitation_probability_max[idx] ?? 0,
      precipitationSum: forecastData.daily.precipitation_sum[idx] ?? 0,
      sunrise: forecastData.daily.sunrise?.[idx] ? new Date(forecastData.daily.sunrise[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '--',
      sunset: forecastData.daily.sunset?.[idx] ? new Date(forecastData.daily.sunset[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '--',
      uvIndexMax: forecastData.daily.uv_index_max?.[idx] ?? 0,
      windSpeedMax: forecastData.daily.wind_speed_10m_max?.[idx] ?? 0,
    });
  });

  return {
    location,
    current: {
      temperature: cur.temperature_2m,
      apparentTemperature: cur.apparent_temperature,
      relativeHumidity: cur.relative_humidity_2m,
      windSpeed: cur.wind_speed_10m,
      windDirection: cur.wind_direction_10m,
      windGusts: cur.wind_gusts_10m ?? cur.wind_speed_10m * 1.3,
      weatherCode: cur.weather_code,
      precipitation: cur.precipitation ?? 0,
      pressure: Math.round(cur.pressure_msl ?? cur.surface_pressure ?? 1013),
      uvIndex: cur.uv_index ?? 0,
      cloudCover: cur.cloud_cover ?? 0,
      visibility: Math.round((cur.visibility ?? 10000) / 1000), // in km
      isDay: Boolean(cur.is_day),
      dewPoint: Number(dewPoint.toFixed(1)),
      time: cur.time,
    },
    hourly,
    daily,
    airQuality: airQualityData,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

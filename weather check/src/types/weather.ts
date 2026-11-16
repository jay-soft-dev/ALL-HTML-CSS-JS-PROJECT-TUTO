export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kmh' | 'mph';

export interface LocationItem {
  id: string | number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isCustom?: boolean;
}

export interface WeatherConditionInfo {
  label: string;
  iconName: string;
  description: string;
  theme: {
    bgGradient: string;
    cardBg: string;
    accent: string;
    textAccent: string;
    badgeBg: string;
  };
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  precipitation: number;
  pressure: number;
  uvIndex: number;
  cloudCover: number;
  visibility: number;
  isDay: boolean;
  dewPoint: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  displayTime: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  precipitationProbability: number;
  windSpeed: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  displayDay: string;
  displayDate: string;
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface AirQualityData {
  aqiUs: number;
  pm25: number;
  pm10: number;
  no2: number;
  ozone: number;
  so2: number;
  status: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
}

export interface WeatherReport {
  location: LocationItem;
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  lastUpdated: string;
}

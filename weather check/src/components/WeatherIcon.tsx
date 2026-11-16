import React from 'react';
import {
  Sun,
  SunDim,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
} from 'lucide-react';
import { getWeatherDetails } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number | string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay = true,
  size = 28,
  className = '',
}) => {
  const details = getWeatherDetails(code, isDay);
  const iconProps = {
    size: typeof size === 'number' ? size : 28,
    className: className || 'w-6 h-6',
  };

  switch (details.icon) {
    case 'Sun':
      return <Sun {...iconProps} className={`${iconProps.className} text-amber-500`} />;
    case 'SunDim':
      return <SunDim {...iconProps} className={`${iconProps.className} text-amber-400`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`${iconProps.className} text-indigo-400`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${iconProps.className} text-amber-500`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`${iconProps.className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${iconProps.className} text-slate-400 dark:text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${iconProps.className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-sky-400`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-500`} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} className={`${iconProps.className} text-cyan-300`} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} className={`${iconProps.className} text-sky-300`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${iconProps.className} text-amber-400`} />;
    default:
      return <Sun {...iconProps} className={`${iconProps.className} text-amber-500`} />;
  }
};

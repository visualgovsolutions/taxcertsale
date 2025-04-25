import React from 'react';
import { Card, Spinner } from 'flowbite-react';
import { IconType } from 'react-icons';
import {
  HiArrowUp,
  HiArrowDown,
  HiMinusCircle,
  HiArrowCircleUp,
  HiArrowCircleDown,
} from 'react-icons/hi';

export interface StatsWidgetProps {
  title: string;
  value: number | string | null;
  previousValue?: number | null;
  loading?: boolean;
  error?: Error | null;
  icon?: IconType;
  iconColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number | string;
  trendLabel?: string;
  onClick?: () => void;
  className?: string;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  title,
  value,
  previousValue,
  loading = false,
  error = null,
  icon: Icon,
  iconColor = 'text-blue-600',
  valuePrefix = '',
  valueSuffix = '',
  trend,
  trendValue,
  trendLabel,
  onClick,
  className = '',
}) => {
  // Calculate trend if not explicitly provided but we have previous value
  const calculatedTrend =
    trend ||
    (previousValue !== undefined && previousValue !== null && typeof value === 'number'
      ? value > previousValue
        ? 'up'
        : value < previousValue
          ? 'down'
          : 'neutral'
      : undefined);

  // Calculate trendValue if not explicitly provided but we have previous value
  const calculatedTrendValue =
    trendValue !== undefined
      ? trendValue
      : previousValue !== undefined && previousValue !== null && typeof value === 'number'
        ? Math.abs(((value - previousValue) / previousValue) * 100).toFixed(1)
        : undefined;

  // Determine trend color and icon
  const trendConfig = {
    up: {
      icon: HiArrowCircleUp,
      color: 'text-green-500',
      label: trendLabel || 'Increase',
    },
    down: {
      icon: HiArrowCircleDown,
      color: 'text-red-500',
      label: trendLabel || 'Decrease',
    },
    neutral: {
      icon: HiMinusCircle,
      color: 'text-gray-500',
      label: trendLabel || 'No change',
    },
  };

  // Get the trend display components if trend is available
  const trendColor = calculatedTrend ? trendConfig[calculatedTrend].color : '';

  // Render trend display based on calculated trend
  const renderTrendDisplay = () => {
    if (!calculatedTrend) return null;

    const TrendIcon = trendConfig[calculatedTrend].icon;

    return (
      <div className={`flex items-center space-x-1 text-sm ${trendColor}`}>
        <TrendIcon className="h-4 w-4" />
        <span>
          {calculatedTrendValue ? `${calculatedTrendValue}% ` : ''}
          {trendConfig[calculatedTrend].label}
        </span>
      </div>
    );
  };

  return (
    <Card
      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h5>
          {loading ? (
            <div className="flex items-center space-x-2">
              <Spinner size="sm" />
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm">Error: {error.message}</div>
          ) : (
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {valuePrefix}
                {value === null || value === undefined ? '-' : value}
                {valueSuffix}
              </div>
              {renderTrendDisplay()}
            </div>
          )}
        </div>
        {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
      </div>
    </Card>
  );
};

export default StatsWidget;

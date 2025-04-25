import React, { useState } from 'react';
import { Card, Dropdown, Button } from 'flowbite-react';
import { HiDotsVertical, HiOutlineRefresh } from 'react-icons/hi';

interface DataPoint {
  label: string;
  value: number;
}

export type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardChartWidgetProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  loading?: boolean;
  error?: Error | null;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onRefresh?: () => void;
  showChart?: boolean;
  chartType?: 'bar' | 'line' | 'pie';
  className?: string;
  height?: string;
}

const DashboardChartWidget: React.FC<DashboardChartWidgetProps> = ({
  title,
  subtitle,
  data,
  loading = false,
  error = null,
  timeRange = 'week',
  onTimeRangeChange,
  onRefresh,
  showChart = true,
  chartType = 'bar',
  className = '',
  height = 'h-72',
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(timeRange);

  const handleTimeRangeChange = (range: TimeRange) => {
    setSelectedTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  // Mock chart implementation - in real world, use a charting library like Chart.js or Recharts
  const renderMockChart = () => {
    if (!showChart) return null;

    // Max value in the data for scaling
    const maxValue = Math.max(...data.map(d => d.value), 1);

    if (chartType === 'bar') {
      return (
        <div className={`${height} flex items-end justify-between gap-1 mt-2`}>
          {data.map((point, index) => {
            const heightPercentage = (point.value / maxValue) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 ease-in-out hover:bg-blue-600"
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="text-xs mt-1 truncate w-full text-center">{point.label}</div>
              </div>
            );
          })}
        </div>
      );
    }

    // This is just a placeholder. In a real implementation, use a proper charting library.
    return (
      <div className={`${height} flex items-center justify-center`}>
        <div className="text-gray-400">
          {chartType === 'line' ? 'Line Chart Placeholder' : 'Pie Chart Placeholder'}
        </div>
      </div>
    );
  };

  const timeRangeLabel = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    quarter: 'This Quarter',
    year: 'This Year',
  };

  return (
    <Card className={`${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h5>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-2">
          {onRefresh && (
            <Button size="xs" color="light" onClick={onRefresh}>
              <HiOutlineRefresh className="h-4 w-4" />
            </Button>
          )}

          {onTimeRangeChange && (
            <Dropdown
              label={timeRangeLabel[selectedTimeRange]}
              size="sm"
              color="light"
              placement="bottom"
            >
              <Dropdown.Item onClick={() => handleTimeRangeChange('day')}>Today</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeRangeChange('week')}>This Week</Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeRangeChange('month')}>
                This Month
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeRangeChange('quarter')}>
                This Quarter
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleTimeRangeChange('year')}>This Year</Dropdown.Item>
            </Dropdown>
          )}

          <Dropdown
            label=""
            dismissOnClick={true}
            renderTrigger={() => (
              <Button size="xs" color="light">
                <HiDotsVertical className="h-4 w-4" />
              </Button>
            )}
          >
            <Dropdown.Item>Download CSV</Dropdown.Item>
            <Dropdown.Item>Download PNG</Dropdown.Item>
            <Dropdown.Item>View Full Report</Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className={`${height} flex items-center justify-center`}>
          <div className="text-gray-400">Loading chart data...</div>
        </div>
      ) : error ? (
        <div className={`${height} flex items-center justify-center`}>
          <div className="text-red-500">Error: {error.message}</div>
        </div>
      ) : data.length === 0 ? (
        <div className={`${height} flex items-center justify-center`}>
          <div className="text-gray-400">No data available</div>
        </div>
      ) : (
        renderMockChart()
      )}
    </Card>
  );
};

export default DashboardChartWidget;

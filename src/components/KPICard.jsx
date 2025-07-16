import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/kpiCalculations';

const KPICard = ({ title, value, format = 'number', trend, subtitle, icon: Icon }) => {
  const formatValue = (val, formatType) => {
    switch (formatType) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
      default:
        return val.toLocaleString();
    }
  };

  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-gray-500';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    if (trend > 0) return '↗';
    if (trend < 0) return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {Icon && <Icon className="text-primary mr-2" size={20} />}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-sm font-medium ${getTrendColor(trend)}`}>
            <span className="mr-1">{getTrendIcon(trend)}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">
          {formatValue(value, format)}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-600 mt-1">
            {subtitle}
          </div>
        )}
      </div>
      
      {/* Progress bar for percentage-based KPIs */}
      {format === 'percentage' && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(value, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default KPICard; 
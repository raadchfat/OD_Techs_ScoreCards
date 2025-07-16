import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/kpiCalculations';
import { getWeekDisplayName } from '../../utils/dateUtils';

const RevenueChart = ({ data, selectedTechnician }) => {
  const chartData = data.map(item => ({
    ...item,
    weekDisplay: getWeekDisplayName(item.week)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-primary font-bold">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="text-primary mr-2" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Weekly Revenue Trend</h3>
      </div>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No revenue data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="weekDisplay" 
              stroke="#6b7280"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      
      {selectedTechnician !== 'all' && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing revenue for: <span className="font-medium">{selectedTechnician}</span>
        </div>
      )}
    </div>
  );
};

export default RevenueChart; 
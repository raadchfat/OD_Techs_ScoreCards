import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const JobStatusChart = ({ data }) => {
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-primary font-bold">
            Jobs: {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={entry.value} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">
            {entry.value}: {data.find(d => d.status === entry.value)?.count || 0}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <PieChartIcon className="text-primary mr-2" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Job Status Distribution</h3>
      </div>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No job status data available</p>
        </div>
      ) : (
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          <CustomLegend payload={data.map((entry, index) => ({
            value: entry.status,
            color: COLORS[index % COLORS.length]
          }))} />
        </div>
      )}
    </div>
  );
};

export default JobStatusChart; 
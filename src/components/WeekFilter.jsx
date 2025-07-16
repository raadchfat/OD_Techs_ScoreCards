import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { getWeekDisplayName } from '../utils/dateUtils';

const WeekFilter = ({ weeks, selectedWeek, onWeekChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center mb-3">
        <Calendar className="text-primary mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Week</h3>
      </div>
      
      <div className="relative">
        <select
          value={selectedWeek}
          onChange={(e) => onWeekChange(e.target.value)}
          className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Weeks</option>
          {weeks.map((week) => (
            <option key={week} value={week}>
              {getWeekDisplayName(week)}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
      
      {selectedWeek !== 'all' && (
        <div className="mt-2 text-sm text-gray-600">
          Showing data for: <span className="font-medium">{getWeekDisplayName(selectedWeek)}</span>
        </div>
      )}
    </div>
  );
};

export default WeekFilter; 
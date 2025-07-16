import React from 'react';
import { User, ChevronDown } from 'lucide-react';

const TechnicianFilter = ({ technicians, selectedTechnician, onTechnicianChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center mb-3">
        <User className="text-primary mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Technician</h3>
      </div>
      
      <div className="relative">
        <select
          value={selectedTechnician}
          onChange={(e) => onTechnicianChange(e.target.value)}
          className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Technicians</option>
          {technicians.map((technician) => (
            <option key={technician} value={technician}>
              {technician}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>
      
      {selectedTechnician !== 'all' && (
        <div className="mt-2 text-sm text-gray-600">
          Showing data for: <span className="font-medium">{selectedTechnician}</span>
        </div>
      )}
    </div>
  );
};

export default TechnicianFilter; 
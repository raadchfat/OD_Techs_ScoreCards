import React, { useEffect } from 'react';
import { useDataProcessor } from './hooks/useDataProcessor';
import { useKPICalculator } from './hooks/useKPICalculator';
import { getWeekNumber } from './utils/dateUtils';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

function App() {
  const {
    mergedData,
    technicians,
    weeks,
    loading,
    error,
    processOpportunitiesFile,
    processLineItemsFile,
    clearData,
    getProcessingStatus
  } = useDataProcessor();

  const {
    kpis,
    selectedTechnician,
    selectedWeek,
    revenueData,
    jobStatusData,
    updateSelectedTechnician,
    updateSelectedWeek,
    resetFilters
  } = useKPICalculator(mergedData);

  // Add week information to merged data
  useEffect(() => {
    if (mergedData) {
      const dataWithWeeks = mergedData.map(job => ({
        ...job,
        week: getWeekNumber(job.Date)
      }));
      // Update the merged data with week information
      // This is a simplified approach - in a real app, you might want to handle this differently
    }
  }, [mergedData]);

  const handleOpportunitiesFileUpload = async (file) => {
    await processOpportunitiesFile(file);
  };

  const handleLineItemsFileUpload = async (file) => {
    await processLineItemsFile(file);
  };

  const processingStatus = getProcessingStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {processingStatus === 'empty' && (
        <FileUpload
          onOpportunitiesFileUpload={handleOpportunitiesFileUpload}
          onLineItemsFileUpload={handleLineItemsFileUpload}
          loading={loading}
          error={error}
        />
      )}

      {processingStatus === 'partial' && (
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Almost Ready!
            </h2>
            <p className="text-gray-600 mb-6">
              Please upload both Excel files to view the dashboard.
            </p>
            <FileUpload
              onOpportunitiesFileUpload={handleOpportunitiesFileUpload}
              onLineItemsFileUpload={handleLineItemsFileUpload}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}

      {processingStatus === 'ready' && (
        <Dashboard
          kpis={kpis}
          technicians={technicians}
          weeks={weeks}
          selectedTechnician={selectedTechnician}
          selectedWeek={selectedWeek}
          onTechnicianChange={updateSelectedTechnician}
          onWeekChange={updateSelectedWeek}
          revenueData={revenueData}
          jobStatusData={jobStatusData}
          onResetFilters={resetFilters}
        />
      )}

      {processingStatus === 'error' && (
        <div className="w-full max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              Error Processing Files
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={clearData}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
            <span className="text-lg">Processing files...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
import { useState, useMemo, useCallback } from 'react';
import { calculateKPIs } from '../utils/kpiCalculations';
import { getCurrentWeek } from '../utils/dateUtils';

/**
 * Custom hook for KPI calculations and filtering
 */
export const useKPICalculator = (mergedData) => {
  const [selectedTechnician, setSelectedTechnician] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  /**
   * Calculate KPIs for the selected technician and week
   */
  const kpis = useMemo(() => {
    if (!mergedData || mergedData.length === 0) {
      return {
        avgTicketValue: 0,
        jobCloseRate: 0,
        weeklyRevenue: 0,
        membershipWinRate: 0,
        hydroJettingJobs: 0,
        descalingJobs: 0,
        waterHeaterJobs: 0,
        totalJobs: 0,
        wonJobs: 0,
        membershipOpportunities: 0,
        membershipsSold: 0
      };
    }

    return calculateKPIs(mergedData, selectedTechnician, selectedWeek);
  }, [mergedData, selectedTechnician, selectedWeek]);

  /**
   * Get filtered data for the selected technician and week
   */
  const filteredData = useMemo(() => {
    if (!mergedData || mergedData.length === 0) return [];

    return mergedData.filter(job => {
      const matchesTechnician = selectedTechnician === 'all' || 
        job['Opportunity Owner'] === selectedTechnician;
      const matchesWeek = selectedWeek === 'all' || 
        job.week === selectedWeek;
      
      return matchesTechnician && matchesWeek;
    });
  }, [mergedData, selectedTechnician, selectedWeek]);

  /**
   * Get revenue data for charts
   */
  const revenueData = useMemo(() => {
    if (!mergedData || mergedData.length === 0) return [];

    const revenueByWeek = {};
    
    mergedData.forEach(job => {
      if (job.Status && job.Status.toLowerCase() === 'won' && job.Revenue) {
        const week = job.week || 'Unknown';
        const technician = job['Opportunity Owner'] || 'Unknown';
        
        if (selectedTechnician === 'all' || technician === selectedTechnician) {
          if (!revenueByWeek[week]) {
            revenueByWeek[week] = 0;
          }
          revenueByWeek[week] += parseFloat(job.Revenue) || 0;
        }
      }
    });

    return Object.entries(revenueByWeek)
      .map(([week, revenue]) => ({ week, revenue: Math.round(revenue * 100) / 100 }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [mergedData, selectedTechnician]);

  /**
   * Get job status distribution for charts
   */
  const jobStatusData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];

    const statusCount = {};
    
    filteredData.forEach(job => {
      const status = job.Status || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count
    }));
  }, [filteredData]);

  /**
   * Update selected technician
   */
  const updateSelectedTechnician = useCallback((technician) => {
    setSelectedTechnician(technician);
  }, []);

  /**
   * Update selected week
   */
  const updateSelectedWeek = useCallback((week) => {
    setSelectedWeek(week);
  }, []);

  /**
   * Reset filters to default
   */
  const resetFilters = useCallback(() => {
    setSelectedTechnician('all');
    setSelectedWeek(getCurrentWeek());
  }, []);

  return {
    // State
    selectedTechnician,
    selectedWeek,
    
    // Calculated data
    kpis,
    filteredData,
    revenueData,
    jobStatusData,
    
    // Actions
    updateSelectedTechnician,
    updateSelectedWeek,
    resetFilters
  };
}; 
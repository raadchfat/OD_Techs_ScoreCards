import { useState, useCallback } from 'react';
import { parseExcelFile, validateOpportunitiesData, validateLineItemsData, cleanData } from '../utils/excelParser';
import { mergeData, getUniqueTechnicians, getUniqueWeeks } from '../utils/kpiCalculations';

/**
 * Custom hook for processing Excel files and managing data state
 */
export const useDataProcessor = () => {
  const [mergedData, setMergedData] = useState(null);
  const [opportunitiesData, setOpportunitiesData] = useState(null);
  const [lineItemsData, setLineItemsData] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Process opportunities Excel file
   */
  const processOpportunitiesFile = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await parseExcelFile(file);
      const cleanedData = cleanData(data);
      const validation = validateOpportunitiesData(cleanedData);
      
      if (!validation.isValid) {
        throw new Error(`Opportunities file validation failed: ${validation.errors.join(', ')}`);
      }
      
      setOpportunitiesData(cleanedData);
      
      // If we have both files, merge the data
      if (lineItemsData) {
        const merged = mergeData(cleanedData, lineItemsData);
        setMergedData(merged);
        setTechnicians(getUniqueTechnicians(merged));
        setWeeks(getUniqueWeeks(merged));
      }
      
      return { success: true, data: cleanedData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [lineItemsData]);

  /**
   * Process line items Excel file
   */
  const processLineItemsFile = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await parseExcelFile(file);
      const cleanedData = cleanData(data);
      const validation = validateLineItemsData(cleanedData);
      
      if (!validation.isValid) {
        throw new Error(`Line items file validation failed: ${validation.errors.join(', ')}`);
      }
      
      setLineItemsData(cleanedData);
      
      // If we have both files, merge the data
      if (opportunitiesData) {
        const merged = mergeData(opportunitiesData, cleanedData);
        setMergedData(merged);
        setTechnicians(getUniqueTechnicians(merged));
        setWeeks(getUniqueWeeks(merged));
      }
      
      return { success: true, data: cleanedData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [opportunitiesData]);

  /**
   * Clear all data and reset state
   */
  const clearData = useCallback(() => {
    setMergedData(null);
    setOpportunitiesData(null);
    setLineItemsData(null);
    setTechnicians([]);
    setWeeks([]);
    setError(null);
  }, []);

  /**
   * Get processing status
   */
  const getProcessingStatus = useCallback(() => {
    if (loading) return 'processing';
    if (error) return 'error';
    if (mergedData) return 'ready';
    if (opportunitiesData || lineItemsData) return 'partial';
    return 'empty';
  }, [loading, error, mergedData, opportunitiesData, lineItemsData]);

  return {
    // State
    mergedData,
    opportunitiesData,
    lineItemsData,
    technicians,
    weeks,
    loading,
    error,
    
    // Actions
    processOpportunitiesFile,
    processLineItemsFile,
    clearData,
    getProcessingStatus
  };
}; 
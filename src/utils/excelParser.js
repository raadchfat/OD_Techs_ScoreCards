import * as XLSX from 'xlsx';

/**
 * Parse an Excel file and return JSON data
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Parsed data as JSON array
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          raw: false
        });
        
        // Convert to array of objects with headers
        if (jsonData.length > 0) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          const result = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              if (header) {
                obj[header] = row[index] || '';
              }
            });
            return obj;
          });
          
          resolve(result);
        } else {
          resolve([]);
        }
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validate opportunities data structure
 * @param {Array} data - Parsed opportunities data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateOpportunitiesData = (data) => {
  const requiredColumns = ['Date', 'Job', 'Customer', 'Opportunity Owner', 'Status', 'Revenue'];
  const errors = [];
  
  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data found in file'] };
  }
  
  const firstRow = data[0];
  const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate line items data structure
 * @param {Array} data - Parsed line items data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateLineItemsData = (data) => {
  const requiredColumns = ['Job', 'Opp. Owner', 'Category', 'Line Item', 'Price'];
  const errors = [];
  
  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data found in file'] };
  }
  
  const firstRow = data[0];
  const missingColumns = requiredColumns.filter(col => !firstRow.hasOwnProperty(col));
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Clean and normalize data
 * @param {Array} data - Raw data array
 * @returns {Array} Cleaned data array
 */
export const cleanData = (data) => {
  return data.map(row => {
    const cleaned = {};
    Object.keys(row).forEach(key => {
      let value = row[key];
      
      // Convert empty strings to null
      if (value === '') {
        value = null;
      }
      
      // Clean up whitespace
      if (typeof value === 'string') {
        value = value.trim();
      }
      
      cleaned[key] = value;
    });
    return cleaned;
  }).filter(row => {
    // Remove rows where all values are null/empty
    return Object.values(row).some(value => value !== null && value !== '');
  });
}; 
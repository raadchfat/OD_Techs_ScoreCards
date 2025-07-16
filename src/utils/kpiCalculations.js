import { getWeekNumber } from './dateUtils';

/**
 * Count service jobs based on category or line item keywords
 * @param {Array} jobs - Array of jobs with line items
 * @param {string} serviceType - Service type to search for
 * @returns {number} Count of jobs with the specified service
 */
export const countServiceJobs = (jobs, serviceType) => {
  if (!jobs || jobs.length === 0) return 0;
  
  const keywords = serviceType.toLowerCase().split(' ');
  
  return jobs.filter(job => {
    if (!job.lineItems || job.lineItems.length === 0) return false;
    
    return job.lineItems.some(item => {
      const category = (item.Category || '').toLowerCase();
      const lineItem = (item['Line Item'] || '').toLowerCase();
      
      return keywords.some(keyword => 
        category.includes(keyword) || lineItem.includes(keyword)
      );
    });
  }).length;
};

/**
 * Calculate KPIs for a specific technician and week
 * @param {Array} mergedData - Merged opportunities and line items data
 * @param {string} technician - Technician name to filter by
 * @param {string} week - Week identifier to filter by
 * @returns {Object} Calculated KPIs
 */
export const calculateKPIs = (mergedData, technician, week) => {
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

  // Filter jobs by technician and week
  const filteredJobs = mergedData.filter(job => {
    const jobWeek = getWeekNumber(job.Date);
    const matchesTechnician = technician === 'all' || job['Opportunity Owner'] === technician;
    const matchesWeek = week === 'all' || jobWeek === week;
    
    return matchesTechnician && matchesWeek;
  });

  // Filter out invalid jobs
  const validJobs = filteredJobs.filter(job => 
    job.Status && job.Status.toLowerCase() !== 'invalid'
  );

  // Get won jobs
  const wonJobs = validJobs.filter(job => 
    job.Status && job.Status.toLowerCase() === 'won'
  );

  // Calculate basic metrics
  const totalJobs = validJobs.length;
  const wonJobsCount = wonJobs.length;
  const totalRevenue = wonJobs.reduce((sum, job) => {
    const revenue = parseFloat(job.Revenue) || 0;
    return sum + revenue;
  }, 0);

  // Calculate membership metrics
  const membershipOpportunities = validJobs.filter(job => 
    job['Membership Opportunity'] && 
    job['Membership Opportunity'].toString().toLowerCase() === 'yes'
  ).length;

  const membershipsSold = validJobs.filter(job => 
    job['Membership Sold'] && 
    job['Membership Sold'].toString().toLowerCase() === 'yes'
  ).length;

  // Calculate service-specific jobs
  const hydroJettingJobs = countServiceJobs(wonJobs, 'hydro jetting');
  const descalingJobs = countServiceJobs(wonJobs, 'descal');
  const waterHeaterJobs = countServiceJobs(wonJobs, 'water heater');

  // Calculate KPIs
  const avgTicketValue = wonJobsCount > 0 ? totalRevenue / wonJobsCount : 0;
  const jobCloseRate = totalJobs > 0 ? (wonJobsCount / totalJobs) * 100 : 0;
  const membershipWinRate = membershipOpportunities > 0 ? 
    (membershipsSold / membershipOpportunities) * 100 : 0;

  return {
    avgTicketValue: Math.round(avgTicketValue * 100) / 100,
    jobCloseRate: Math.round(jobCloseRate * 100) / 100,
    weeklyRevenue: Math.round(totalRevenue * 100) / 100,
    membershipWinRate: Math.round(membershipWinRate * 100) / 100,
    hydroJettingJobs,
    descalingJobs,
    waterHeaterJobs,
    totalJobs,
    wonJobs: wonJobsCount,
    membershipOpportunities,
    membershipsSold
  };
};

/**
 * Get unique technicians from data
 * @param {Array} data - Merged data array
 * @returns {Array} Array of unique technician names
 */
export const getUniqueTechnicians = (data) => {
  if (!data || data.length === 0) return [];
  
  const technicians = data
    .map(job => job['Opportunity Owner'])
    .filter(tech => tech && tech.trim() !== '')
    .filter((tech, index, arr) => arr.indexOf(tech) === index);
  
  return technicians.sort();
};

/**
 * Get unique weeks from data
 * @param {Array} data - Merged data array
 * @returns {Array} Array of unique week identifiers
 */
export const getUniqueWeeks = (data) => {
  if (!data || data.length === 0) return [];
  
  const weeks = data
    .map(job => getWeekNumber(job.Date))
    .filter(week => week !== null)
    .filter((week, index, arr) => arr.indexOf(week) === index);
  
  return weeks.sort();
};

/**
 * Merge opportunities and line items data
 * @param {Array} opportunitiesData - Opportunities data
 * @param {Array} lineItemsData - Line items data
 * @returns {Array} Merged data array
 */
export const mergeData = (opportunitiesData, lineItemsData) => {
  if (!opportunitiesData || opportunitiesData.length === 0) {
    return [];
  }

  // Create a map of line items by Job ID
  const lineItemsMap = {};
  if (lineItemsData && lineItemsData.length > 0) {
    lineItemsData.forEach(item => {
      const jobId = item.Job;
      if (jobId) {
        if (!lineItemsMap[jobId]) {
          lineItemsMap[jobId] = [];
        }
        lineItemsMap[jobId].push(item);
      }
    });
  }

  // Merge data
  return opportunitiesData.map(opportunity => ({
    ...opportunity,
    lineItems: lineItemsMap[opportunity.Job] || []
  }));
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
}; 
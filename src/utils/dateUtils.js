/**
 * Get the week number from a date string
 * @param {string} dateString - Date string in any format
 * @returns {string} Week identifier in format "YYYY-WXX"
 */
export const getWeekNumber = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

/**
 * Get the current week number
 * @returns {string} Current week identifier
 */
export const getCurrentWeek = () => {
  return getWeekNumber(new Date());
};

/**
 * Get all weeks from a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string[]} Array of week identifiers
 */
export const getWeeksInRange = (startDate, endDate) => {
  const weeks = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const week = getWeekNumber(current);
    if (week && !weeks.includes(week)) {
      weeks.push(week);
    }
    current.setDate(current.getDate() + 7);
  }
  
  return weeks.sort();
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get week display name
 * @param {string} weekId - Week identifier (e.g., "2024-W01")
 * @returns {string} Formatted week name
 */
export const getWeekDisplayName = (weekId) => {
  if (!weekId) return 'Unknown Week';
  
  const [year, week] = weekId.split('-W');
  return `Week ${week}, ${year}`;
}; 
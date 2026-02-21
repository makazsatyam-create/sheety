/**
 * Date utility functions for consistent UTC-based date handling
 */

/**
 * Creates a UTC date range for MongoDB queries.
 * Converts date strings (YYYY-MM-DD) to proper UTC boundaries.
 *
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {{ $gte: Date, $lte: Date }} MongoDB date range query object
 *
 * @example
 * // Returns { $gte: 2026-01-19T00:00:00.000Z, $lte: 2026-01-19T23:59:59.999Z }
 * getDateRangeUTC('2026-01-19', '2026-01-19')
 */
export const getDateRangeUTC = (startDate, endDate) => {
  // Parse dates as UTC by appending time component
  // This ensures "2026-01-19" is interpreted as "2026-01-19T00:00:00.000Z"
  const startDay = startDate.substring(0, 10);
  const endDay = endDate.substring(0, 10);

  const startUTC = new Date(`${startDay}T00:00:00.000Z`);
  const endUTC = new Date(`${endDay}T23:59:59.999Z`);

  return {
    $gte: startUTC,
    $lte: endUTC,
  };
};

/**
 * Creates a UTC date range for querying multiple date fields with $or.
 * Used when data might have timestamps in either 'date' or 'createdAt' fields.
 *
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Array} MongoDB $or array for date and createdAt fields
 */
export const getDateRangeUTCWithOr = (startDate, endDate) => {
  const range = getDateRangeUTC(startDate, endDate);
  return [{ date: range }, { createdAt: range }];
};

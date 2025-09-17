/**
 * Currency conversion utility
 * Contains functions for converting between currencies
 */

// Current exchange rate (as of September 2025)
export const USD_TO_INR_RATE = 83.25;

/**
 * Converts USD amount to INR (Indian Rupees)
 * @param {number} amountUSD - Amount in US Dollars
 * @returns {number} - Equivalent amount in Indian Rupees
 */
export const convertUSDtoINR = (amountUSD) => {
  if (typeof amountUSD !== 'number' || isNaN(amountUSD)) {
    return 0;
  }
  return amountUSD * USD_TO_INR_RATE;
};

/**
 * Converts INR amount to USD
 * @param {number} amountINR - Amount in Indian Rupees
 * @returns {number} - Equivalent amount in US Dollars
 */
export const convertINRtoUSD = (amountINR) => {
  if (typeof amountINR !== 'number' || isNaN(amountINR)) {
    return 0;
  }
  return amountINR / USD_TO_INR_RATE;
};

/**
 * Formats currency amount with appropriate symbol and formatting
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code ('USD' or 'INR')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0;
  }
  
  if (currency === 'INR') {
    // Indian Rupee formatting
    return `₹${amount.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  } else {
    // Default USD formatting
    return `$${amount.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  }
};

export default {
  convertUSDtoINR,
  convertINRtoUSD,
  formatCurrency,
  USD_TO_INR_RATE
};
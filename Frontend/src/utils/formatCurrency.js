/**
 * Format amount in Indian currency format with comma separators
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount string
 */
export const formatIndianCurrency = (amount) => {
  if (!amount) return '0';
  const numStr = Math.floor(amount).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
};

/**
 * Format amount in short form (Cr, L, K)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount string
 */
export const formatAmountShort = (amount) => {
  if (amount >= 10000000) { // 1 crore and above
    return (amount / 10000000).toFixed(1) + 'Cr';
  } else if (amount >= 100000) { // 1 lakh and above
    return (amount / 100000).toFixed(1) + 'L';
  } else if (amount >= 1000) { // 1 thousand and above
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount.toFixed(0);
};

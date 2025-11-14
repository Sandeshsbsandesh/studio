/**
 * Currency formatting utilities for Indian Rupee (₹)
 */

/**
 * Format amount in Indian Rupees
 * @param amount - The amount to format
 * @returns Formatted string with ₹ symbol and Indian locale formatting
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Format amount in Indian Rupees with decimal places
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with ₹ symbol and decimals
 */
export function formatCurrencyWithDecimals(amount: number, decimals: number = 2): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Format amount for compact display (e.g., 1.5k, 2.3M)
 * @param amount - The amount to format
 * @returns Compact formatted string with ₹ symbol
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount}`;
}

/**
 * Parse currency string to number
 * @param currencyString - String like "₹1,234" or "1234"
 * @returns Numeric value
 */
export function parseCurrency(currencyString: string): number {
  const numericString = currencyString.replace(/[₹,\s]/g, '');
  return parseFloat(numericString) || 0;
}


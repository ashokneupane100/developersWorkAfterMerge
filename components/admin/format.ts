/**
 * Formats a number as currency (e.g. Rs. 32,00,000)
 * 
 * @param value The number to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Price not specified';
  
  // Format numbers in Nepali style (with lakh, crore)
  if (value >= 10000000) {
    // More than 1 crore
    const crores = value / 10000000;
    return `Rs. ${crores.toFixed(2)} Cr`;
  } else if (value >= 100000) {
    // More than 1 lakh
    const lakhs = value / 100000;
    return `Rs. ${lakhs.toFixed(2)} Lakh`;
  } else {
    // Regular formatting
    return `Rs. ${value.toLocaleString('en-IN')}`;
  }
}

/**
 * Formats a date string to a readable format
 * 
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Truncates text with ellipsis if it exceeds maxLength
 * 
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
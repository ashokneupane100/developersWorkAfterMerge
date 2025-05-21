// utils/sparrowSms.js
import axios from 'axios';

// Sparrow SMS API configuration
const SPARROW_SMS_API_URL = 'https://api.sparrowsms.com/v2/sms/';
const SPARROW_SMS_TOKEN = process.env.SPARROW_SMS_TOKEN;
const SPARROW_SMS_FROM = process.env.SPARROW_SMS_FROM || 'Demo';

/**
 * Send SMS using Sparrow SMS API
 * @param {string} phoneNumber - 10 digit phone number (without country code)
 * @param {string} message - SMS message content
 * @returns {Promise} - Response from Sparrow SMS API
 */
export async function sendSms(phoneNumber, message) {
  try {
    // Validate phone number format (10 digits)
    const cleanedPhone = phoneNumber.toString().replace(/\D/g, '');
    const validPhoneNumber = cleanedPhone.slice(-10);
    
    if (validPhoneNumber.length !== 10) {
      console.error('Invalid phone number format:', phoneNumber);
      return { success: false, error: 'Invalid phone number format' };
    }

    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      console.log('DEV MODE - SMS would be sent:');
      console.log('  To:', validPhoneNumber);
      console.log('  Message:', message);
      console.log('  Length:', message.length, 'characters');
      // Return success for dev environment without sending
      return { success: true, data: { count: 1, response_code: 200, response: 'dev mode' } };
    }

    // Prepare request parameters
    const params = new URLSearchParams({
      token: SPARROW_SMS_TOKEN,
      from: SPARROW_SMS_FROM,
      to: validPhoneNumber,
      text: message
    });

    // Send SMS request
    const response = await axios.post(SPARROW_SMS_API_URL, params);
    
    console.log('SMS sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending SMS:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Calculate distance between two coordinates in kilometers
 * @param {Object} coord1 - { lat: number, lng: number }
 * @param {Object} coord2 - { lat: number, lng: number }
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  // Enhanced validation
  if (!coord1 || !coord2) {
    console.warn('calculateDistance: One or both coordinates are undefined/null');
    return Infinity;
  }
  
  if (!coord1.lat || !coord1.lng || !coord2.lat || !coord2.lng) {
    console.warn('calculateDistance: Invalid coordinate format', { coord1, coord2 });
    return Infinity;
  }
  
  // Convert strings to numbers if needed
  const lat1 = Number(coord1.lat);
  const lng1 = Number(coord1.lng);
  const lat2 = Number(coord2.lat);
  const lng2 = Number(coord2.lng);
  
  if (isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    console.warn('calculateDistance: Coordinates contain NaN values');
    return Infinity;
  }
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Check if two budget ranges overlap
 * @param {string|number} budget1 - Budget range or value from property request
 * @param {string|number} budget2 - Budget range or value from listing
 * @returns {boolean} - True if budget ranges overlap
 */
export function budgetRangesOverlap(budget1, budget2) {
  // Enhanced debug logging
  console.log('budgetRangesOverlap called with:', { budget1, budget2 });
  
  if (!budget1 || !budget2) {
    console.warn('budgetRangesOverlap: One or both budgets are undefined/null');
    return false;
  }
  
  // Define budget ranges and their numeric boundaries
  const budgetRanges = {
    // Land/House budget ranges
    'Under 50 Lakh': { min: 0, max: 5000000 },
    '50 Lakh - 1 Crore': { min: 5000000, max: 10000000 },
    '1 Crore - 2 Crore': { min: 10000000, max: 20000000 },
    '2 Crore - 3 Crore': { min: 20000000, max: 30000000 },
    '3 Crore - 5 Crore': { min: 30000000, max: 50000000 },
    'Above 5 Crore': { min: 50000000, max: Infinity },
    
    // Room/Shop budget ranges
    'Under 10K': { min: 0, max: 10000 },
    '10K - 20K': { min: 10000, max: 20000 },
    '20K - 30K': { min: 20000, max: 30000 },
    '30K - 40K': { min: 30000, max: 40000 },
    '40K - 60K': { min: 40000, max: 60000 },
    'Above 60K': { min: 60000, max: Infinity }
  };
  
  // Handle numeric budget values by converting them to range strings
  let budget1Range = budget1;
  let budget2Range = budget2;
  
  // Convert numeric budget1 to range string
  if (typeof budget1 === 'number' || !isNaN(Number(budget1))) {
    const numericBudget = Number(budget1);
    
    // For Land/House (assuming higher price ranges)
    if (numericBudget > 100000) { // Assuming above 1 lakh
      if (numericBudget < 5000000) budget1Range = 'Under 50 Lakh';
      else if (numericBudget < 10000000) budget1Range = '50 Lakh - 1 Crore';
      else if (numericBudget < 20000000) budget1Range = '1 Crore - 2 Crore';
      else if (numericBudget < 30000000) budget1Range = '2 Crore - 3 Crore';
      else if (numericBudget < 50000000) budget1Range = '3 Crore - 5 Crore';
      else budget1Range = 'Above 5 Crore';
    } 
    // For Room/Shop (assuming lower price ranges)
    else {
      if (numericBudget < 10000) budget1Range = 'Under 10K';
      else if (numericBudget < 20000) budget1Range = '10K - 20K';
      else if (numericBudget < 30000) budget1Range = '20K - 30K';
      else if (numericBudget < 40000) budget1Range = '30K - 40K';
      else if (numericBudget < 60000) budget1Range = '40K - 60K';
      else budget1Range = 'Above 60K';
    }
  }
  
  // Convert numeric budget2 to range string
  if (typeof budget2 === 'number' || !isNaN(Number(budget2))) {
    const numericBudget = Number(budget2);
    
    // For Land/House (assuming higher price ranges)
    if (numericBudget > 100000) { // Assuming above 1 lakh
      if (numericBudget < 5000000) budget2Range = 'Under 50 Lakh';
      else if (numericBudget < 10000000) budget2Range = '50 Lakh - 1 Crore';
      else if (numericBudget < 20000000) budget2Range = '1 Crore - 2 Crore';
      else if (numericBudget < 30000000) budget2Range = '2 Crore - 3 Crore';
      else if (numericBudget < 50000000) budget2Range = '3 Crore - 5 Crore';
      else budget2Range = 'Above 5 Crore';
    } 
    // For Room/Shop (assuming lower price ranges)
    else {
      if (numericBudget < 10000) budget2Range = 'Under 10K';
      else if (numericBudget < 20000) budget2Range = '10K - 20K';
      else if (numericBudget < 30000) budget2Range = '20K - 30K';
      else if (numericBudget < 40000) budget2Range = '30K - 40K';
      else if (numericBudget < 60000) budget2Range = '40K - 60K';
      else budget2Range = 'Above 60K';
    }
  }
  
  console.log('Converted budget ranges:', { budget1Range, budget2Range });
  
  // Get the ranges for both budgets
  const range1 = budgetRanges[budget1Range];
  const range2 = budgetRanges[budget2Range];
  
  console.log('Numeric ranges:', { range1, range2 });
  
  if (!range1 || !range2) {
    console.warn('budgetRangesOverlap: One or both ranges undefined for:', { budget1Range, budget2Range });
    return false;
  }
  
  // Check if the ranges overlap
  const overlap = range1.min <= range2.max && range2.min <= range1.max;
  console.log('Budget ranges overlap result:', overlap);
  
  return overlap;
}
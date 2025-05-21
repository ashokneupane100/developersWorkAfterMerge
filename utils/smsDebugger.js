// utils/smsDebugger.js
import { budgetRangesOverlap, calculateDistance } from './sparrowSms';

/**
 * Enhanced budget range overlap check with debugging
 * @param {string|number} budget1 - Budget value from property request
 * @param {string|number} budget2 - Budget value from listing
 * @returns {object} - Result with detailed information
 */
export function debugBudgetOverlap(budget1, budget2) {
  console.log('DEBUG - Budget Comparison:');
  console.log('  Budget 1:', budget1, typeof budget1);
  console.log('  Budget 2:', budget2, typeof budget2);
  
  // Handle cases where raw numeric values are provided
  const budget1Str = typeof budget1 === 'number' ? convertNumericToBudgetRange(budget1) : budget1;
  const budget2Str = typeof budget2 === 'number' ? convertNumericToBudgetRange(budget2) : budget2;
  
  console.log('  Converted Budget 1:', budget1Str);
  console.log('  Converted Budget 2:', budget2Str);
  
  // Check if exact strings match predefined ranges
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
  
  const range1 = budgetRanges[budget1Str];
  const range2 = budgetRanges[budget2Str];
  
  console.log('  Range 1:', range1);
  console.log('  Range 2:', range2);
  
  if (!range1 || !range2) {
    console.log('  RESULT: No match - one or both ranges undefined');
    return { 
      match: false, 
      reason: 'One or both budget strings do not match predefined ranges' 
    };
  }
  
  const overlap = range1.min <= range2.max && range2.min <= range1.max;
  console.log('  RESULT:', overlap ? 'MATCH' : 'NO MATCH');
  
  return {
    match: overlap,
    reason: overlap ? 'Ranges overlap' : 'Ranges do not overlap',
    range1: range1,
    range2: range2
  };
}

/**
 * Convert a numeric price value to a budget range string
 * @param {number} price - Numeric price value
 * @returns {string} - Corresponding budget range
 */
export function convertNumericToBudgetRange(price) {
  if (typeof price !== 'number') {
    try {
      price = Number(price);
    } catch (e) {
      return null;
    }
  }
  
  // For Land/House (assuming higher price ranges)
  if (price > 100000) { // Assuming above 1 lakh
    if (price < 5000000) return 'Under 50 Lakh';
    if (price < 10000000) return '50 Lakh - 1 Crore';
    if (price < 20000000) return '1 Crore - 2 Crore';
    if (price < 30000000) return '2 Crore - 3 Crore';
    if (price < 50000000) return '3 Crore - 5 Crore';
    return 'Above 5 Crore';
  } 
  // For Room/Shop (assuming lower price ranges)
  else {
    if (price < 10000) return 'Under 10K';
    if (price < 20000) return '10K - 20K';
    if (price < 30000) return '20K - 30K';
    if (price < 40000) return '30K - 40K';
    if (price < 60000) return '40K - 60K';
    return 'Above 60K';
  }
}

/**
 * Debug coordinate parsing and distance calculation
 * @param {object|string} coord1 - First coordinate
 * @param {object|string} coord2 - Second coordinate
 * @returns {object} - Result with detailed information
 */
export function debugDistanceCalculation(coord1, coord2) {
  console.log('DEBUG - Distance Calculation:');
  console.log('  Original Coord1:', coord1, typeof coord1);
  console.log('  Original Coord2:', coord2, typeof coord2);
  
  // Parse coordinates if they're strings
  let parsedCoord1, parsedCoord2;
  
  try {
    parsedCoord1 = typeof coord1 === 'string' ? JSON.parse(coord1) : coord1;
  } catch (e) {
    console.log('  ERROR parsing coord1:', e.message);
    // Try alternative parsing for "lat,lng" format
    if (typeof coord1 === 'string' && coord1.includes(',')) {
      const parts = coord1.split(',').map(part => parseFloat(part.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsedCoord1 = { lat: parts[0], lng: parts[1] };
      }
    }
  }
  
  try {
    parsedCoord2 = typeof coord2 === 'string' ? JSON.parse(coord2) : coord2;
  } catch (e) {
    console.log('  ERROR parsing coord2:', e.message);
    // Try alternative parsing for "lat,lng" format
    if (typeof coord2 === 'string' && coord2.includes(',')) {
      const parts = coord2.split(',').map(part => parseFloat(part.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        parsedCoord2 = { lat: parts[0], lng: parts[1] };
      }
    }
  }
  
  console.log('  Parsed Coord1:', parsedCoord1);
  console.log('  Parsed Coord2:', parsedCoord2);
  
  if (!parsedCoord1?.lat || !parsedCoord1?.lng || !parsedCoord2?.lat || !parsedCoord2?.lng) {
    console.log('  RESULT: Cannot calculate distance - invalid coordinates');
    return {
      distance: Infinity,
      valid: false,
      reason: 'One or both coordinates are invalid'
    };
  }
  
  const distance = calculateDistance(parsedCoord1, parsedCoord2);
  console.log('  RESULT: Distance =', distance.toFixed(2), 'km');
  
  return {
    distance: distance,
    valid: true,
    coord1: parsedCoord1,
    coord2: parsedCoord2
  };
}

/**
 * Debug the entire property matching process
 * @param {object} request - Property request object 
 * @param {object} listing - Listing object
 * @returns {object} - Match results with detailed information
 */
export function debugPropertyMatch(request, listing) {
  console.log('===== DEBUG PROPERTY MATCH =====');
  console.log('Request:', request);
  console.log('Listing:', listing);
  
  // Check property type match
  const propertyTypeMatch = request.propertyType === listing.propertyType ||
                           request.property_type === listing.property_type ||
                           request.propertyType === listing.property_type ||
                           request.property_type === listing.propertyType;
  
  console.log('Property Type Match:', propertyTypeMatch);
  console.log('  Request type:', request.propertyType || request.property_type);
  console.log('  Listing type:', listing.propertyType || listing.property_type);
  
  // Check distance match
  const requestCoords = request.coordinates;
  const listingCoords = listing.coordinates;
  const distanceResult = debugDistanceCalculation(requestCoords, listingCoords);
  
  // Default max distance
  const MAX_DISTANCE_KM = 5;
  const distanceMatch = distanceResult.valid && distanceResult.distance <= MAX_DISTANCE_KM;
  
  // Check budget match
  const requestBudget = request.budget;
  const listingBudget = listing.priceRange || listing.price_range || listing.price;
  const budgetResult = debugBudgetOverlap(requestBudget, listingBudget);
  
  // Overall match result
  const isMatch = propertyTypeMatch && distanceMatch && budgetResult.match;
  
  console.log('MATCH SUMMARY:');
  console.log('  Property Type Match:', propertyTypeMatch);
  console.log('  Distance Match:', distanceMatch, `(${distanceResult.valid ? distanceResult.distance.toFixed(2) + ' km' : 'invalid'})`);
  console.log('  Budget Match:', budgetResult.match);
  console.log('  OVERALL MATCH:', isMatch);
  console.log('============================');
  
  return {
    isMatch,
    propertyTypeMatch,
    distanceMatch,
    budgetMatch: budgetResult.match,
    distanceResult,
    budgetResult
  };
}
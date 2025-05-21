// scripts/testSmsNotifications.js
import { debugPropertyMatch } from '../utils/smsDebugger';

/**
 * Test utility for diagnosing SMS notification issues
 * 
 * How to use:
 * 1. Save this file in a 'scripts' directory
 * 2. Add sample data for your listing and property request below
 * 3. Run with: NODE_ENV=development node scripts/testSmsNotifications.js
 */

// Sample listing data - Replace with your actual data
const sampleListing = {
  id: 'test-listing-id',
  propertyType: 'House', // Should match exactly with property_request.property_type
  coordinates: JSON.stringify({ lat: 27.7172, lng: 85.3240 }), // Kathmandu coordinates
  price: 12000000, // 1.2 crore
  priceRange: '1 Crore - 2 Crore',
  address: 'Baluwatar, Kathmandu',
  createdBy: 'owner@example.com'
};

// Sample property request data - Replace with your actual data
const samplePropertyRequest = {
  id: 'test-request-id',
  propertyType: 'House', // Should match listing.propertyType
  coordinates: JSON.stringify({ lat: 27.7150, lng: 85.3250 }), // Close to listing
  budget: '1 Crore - 2 Crore', // Should overlap with listing price range
  location: 'Maharajgunj, Kathmandu',
  phone: '9812345678'
};

// Different test cases
const testCases = [
  {
    name: 'Perfect Match',
    listing: {
      ...sampleListing
    },
    request: {
      ...samplePropertyRequest
    }
  },
  {
    name: 'Different Property Types',
    listing: {
      ...sampleListing,
      propertyType: 'Land'
    },
    request: {
      ...samplePropertyRequest,
      propertyType: 'House'
    }
  },
  {
    name: 'Far Distance',
    listing: {
      ...sampleListing,
      coordinates: JSON.stringify({ lat: 27.8000, lng: 85.4000 })
    },
    request: {
      ...samplePropertyRequest
    }
  },
  {
    name: 'Non-Overlapping Budget',
    listing: {
      ...sampleListing,
      price: 4000000,
      priceRange: 'Under 50 Lakh'
    },
    request: {
      ...samplePropertyRequest,
      budget: 'Above 5 Crore'
    }
  },
  {
    name: 'Numeric vs String Budget',
    listing: {
      ...sampleListing,
      price: 12000000, // 1.2 crore - numeric value only
      priceRange: null
    },
    request: {
      ...samplePropertyRequest,
      budget: '1 Crore - 2 Crore'
    }
  },
  {
    name: 'String vs Numeric Budget',
    listing: {
      ...sampleListing,
      price: null,
      priceRange: '1 Crore - 2 Crore'
    },
    request: {
      ...samplePropertyRequest,
      budget: 15000000 // 1.5 crore - numeric value
    }
  },
  {
    name: 'Alternative Property Type Field',
    listing: {
      ...sampleListing,
      propertyType: null,
      property_type: 'House'
    },
    request: {
      ...samplePropertyRequest
    }
  },
  {
    name: 'Alternative Budget Fields',
    listing: {
      ...sampleListing,
      priceRange: null,
      price_range: '1 Crore - 2 Crore'
    },
    request: {
      ...samplePropertyRequest
    }
  },
  {
    name: 'Testing with your production data',
    listing: {
      // REPLACE WITH YOUR ACTUAL LISTING DATA
      id: 'your-listing-id',
      propertyType: 'House', // or your specific property type
      coordinates: JSON.stringify({ lat: 0, lng: 0 }), // your actual coordinates
      price: 0, // your actual price
      priceRange: 'Your Price Range',
      address: 'Your Address',
      createdBy: 'your@email.com'
    },
    request: {
      // REPLACE WITH YOUR ACTUAL REQUEST DATA
      id: 'your-request-id',
      propertyType: 'House', // your actual property type
      coordinates: JSON.stringify({ lat: 0, lng: 0 }), // your actual coordinates
      budget: 'Your Budget Range',
      location: 'Your Location',
      phone: 'Your Phone'
    }
  }
];

// Run tests
console.log('=== SMS NOTIFICATION MATCHING TESTS ===');
testCases.forEach(testCase => {
  console.log(`\n\n>>> TEST CASE: ${testCase.name}`);
  const result = debugPropertyMatch(testCase.request, testCase.listing);
  
  console.log('Match Result:', result.isMatch ? 'MATCH ✅' : 'NO MATCH ❌');
  if (!result.isMatch) {
    console.log('Failed on:');
    if (!result.propertyTypeMatch) console.log(' - Property Type Mismatch');
    if (!result.distanceMatch) console.log(' - Distance Too Far');
    if (!result.budgetMatch) console.log(' - Budget Ranges Don\'t Overlap');
  }
});
console.log('\n=== END OF TESTS ===');

// Utility to generate and print an example SMS message
function generateExampleSmsMessage(request, listing) {
  console.log('\n=== EXAMPLE SMS MESSAGES ===');
  
  // For property owner (when a new request matches their listing)
  const ownerMessage = `New property request matching your listing! ${request.propertyType} requested in ${request.location.substring(0, 30)}... Budget: ${request.budget}. Contact: ${request.phone}`;
  
  console.log('TO OWNER:');
  console.log(ownerMessage);
  console.log(`Length: ${ownerMessage.length} characters`);
  
  // For property requester (when a new listing matches their request)
  const propertyInfo = listing.title || `${listing.propertyType} in ${listing.address.substring(0, 30)}...`;
  const priceInfo = listing.price ? `Price: ${listing.price}` : listing.priceRange ? `Price range: ${listing.priceRange}` : '';
  
  const requesterMessage = `New property matching your request! ${propertyInfo} ${priceInfo}. Contact: ${listing.createdBy || 'Owner'} or visit our website for details.`;
  
  console.log('\nTO REQUESTER:');
  console.log(requesterMessage);
  console.log(`Length: ${requesterMessage.length} characters`);
  
  console.log('\n=== END OF EXAMPLE MESSAGES ===');
}

// Run the example message generation with the first test case
generateExampleSmsMessage(testCases[0].request, testCases[0].listing);
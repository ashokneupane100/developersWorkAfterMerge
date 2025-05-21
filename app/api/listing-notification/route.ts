// app/api/listing-notification/route.js
import { createClient } from '@supabase/supabase-js';
import { sendSms, calculateDistance, budgetRangesOverlap } from '@/utils/sparrowSms';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl,supabaseKey!);

// Maximum distance in kilometers to consider properties as nearby
const MAX_DISTANCE_KM = 5;

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();
    
    if (!listingId) {
      return Response.json({ error: 'Listing ID is required' }, { status: 400 });
    }
    
    console.log('Starting notification process for listing ID:', listingId);
    
    // Fetch the listing with its details
    const { data: listing, error: listingError } = await supabase
      .from('listing')
      .select('*, listing_details(*)')
      .eq('id', listingId)
      .single();
      
    if (listingError || !listing) {
      console.error('Error fetching listing:', listingError);
      return Response.json({ error: 'Listing not found' }, { status: 404 });
    }
    
    console.log('Found listing:', listing.id);
    
    // Extract listing coordinates
    let listingCoordinates;
    try {
      if (typeof listing.coordinates === 'string') {
        listingCoordinates = JSON.parse(listing.coordinates);
      } else {
        listingCoordinates = listing.coordinates;
      }
      
      // Validate coordinates
      if (!listingCoordinates || !listingCoordinates.lat || !listingCoordinates.lng) {
        return Response.json({ 
          error: 'Invalid listing coordinates', 
          details: 'Coordinates are not properly formatted'
        }, { status: 400 });
      }
    } catch (e:any) {
      console.error('Error parsing listing coordinates:', e);
      return Response.json({ 
        error: 'Invalid listing coordinates', 
        details: e.message 
      }, { status: 400 });
    }
    
    console.log('Listing coordinates:', listingCoordinates);
    
    // Get listing details from appropriate fields
    const propertyType = listing.listing_details?.property_type || listing.propertyType;
    const priceRange = listing.listing_details?.price_range || listing.priceRange;
    const price = listing.listing_details?.price || listing.price;
    const address = listing.address || listing.location || '';
    const title = listing.listing_details?.title || listing.post_title;
    
    console.log('Listing details:');
    console.log('- Property Type:', propertyType);
    console.log('- Price:', price);
    console.log('- Price Range:', priceRange);
    console.log('- Address:', address);
    
    if (!propertyType || !listingCoordinates) {
      return Response.json({ 
        error: 'Incomplete listing information', 
        details: 'Property type or coordinates missing' 
      }, { status: 400 });
    }
    
    // Fetch matching property requests
    const { data: propertyRequests, error: requestsError } = await supabase
      .from('property_requests')
      .select('*');
      
    if (requestsError) {
      console.error('Error fetching property requests:', requestsError);
      return Response.json({ error: 'Failed to fetch property requests' }, { status: 500 });
    }
    
    console.log(`Found ${propertyRequests?.length || 0} total property requests`);
    
    // First filter by property type to reduce the processing load
    const typeFilteredRequests = propertyRequests.filter(request => {
      // Check both possible field names
      const requestType = request.property_type || request.propertyType;
      return requestType === propertyType;
    });
    
    console.log(`Found ${typeFilteredRequests.length} property requests matching property type`);
    
    // Track notification successes and failures
    const notifications = {
      sent: 0,
      failed: 0,
      skipped: 0
    };
    
    // Process each property request
    for (const request of typeFilteredRequests) {
      try {
        console.log('\nEvaluating request:', request.id);
        
        // Parse request coordinates
        let requestCoordinates;
        try {
          if (request.coordinates) {
            if (typeof request.coordinates === 'string') {
              requestCoordinates = JSON.parse(request.coordinates);
            } else {
              requestCoordinates = request.coordinates;
            }
          }
        } catch (e:any) {
          console.warn(`Error parsing coordinates for request ${request.id}:`, e.message);
          notifications.skipped++;
          continue;
        }
        
        // Skip if no valid coordinates
        if (!requestCoordinates?.lat || !requestCoordinates?.lng) {
          console.log(`Request ${request.id} has invalid coordinates - skipping`);
          notifications.skipped++;
          continue;
        }
        
        // Calculate distance between the listing and request
        const distance = calculateDistance(listingCoordinates, requestCoordinates);
        console.log(`Distance: ${distance.toFixed(2)} km`);
        
        // Get budget from appropriate field
        const requestBudget = request.budget;
        console.log('Request budget:', requestBudget);
        
        // Check budget match if both listing and request have budget info
        const budgetMatch = (price || priceRange) && requestBudget ? 
          budgetRangesOverlap(priceRange || price, requestBudget) : 
          false;
        
        console.log('Budget match:', budgetMatch);
        console.log('Distance check:', distance <= MAX_DISTANCE_KM);
        
        // If within desired distance and budget matches, send SMS notification
        if (distance <= MAX_DISTANCE_KM && budgetMatch) {
          // Check if user has a phone number
          if (!request.phone) {
            console.warn(`No phone number for request ${request.id}`);
            notifications.skipped++;
            continue;
          }
          
          // Create and send SMS
          const propertyInfo = title || 
            `${propertyType} in ${address.substring(0, 30)}...`;
          
          const priceInfo = price ? 
            `Price: ${price}` : 
            priceRange ? `Price range: ${priceRange}` : '';
          
          const message = `New property matching your request! ${propertyInfo} ${priceInfo}. Contact: ${listing.createdBy || 'Owner'} or visit our website for details.`;
          
          console.log(`Sending SMS to ${request.phone}:`);
          console.log(`Message: ${message}`);
          
          const smsResult = await sendSms(request.phone, message);
          
          if (smsResult.success) {
            console.log(`Successfully sent SMS to ${request.phone}`);
            notifications.sent++;
          } else {
            console.error(`Failed to send SMS to ${request.phone}:`, smsResult.error);
            notifications.failed++;
          }
        } else {
          console.log(`Request ${request.id} doesn't match criteria - skipping`);
          notifications.skipped++;
        }
      } catch (requestError) {
        console.error(`Error processing request ${request.id}:`, requestError);
        notifications.failed++;
      }
    }
    
    console.log('Notification process completed');
    console.log('Summary:');
    console.log(`- Sent: ${notifications.sent}`);
    console.log(`- Failed: ${notifications.failed}`);
    console.log(`- Skipped: ${notifications.skipped}`);
    
    return Response.json({ 
      success: true, 
      message: 'Notification process completed',
      notifications
    }, { status: 200 });
  } catch (error:any) {
    console.error('Server error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
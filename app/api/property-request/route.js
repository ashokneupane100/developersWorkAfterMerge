// app/api/property-request/route.js
import { createClient } from '@supabase/supabase-js';
import { sendPropertyRequestConfirmationEmail, sendPropertyRequestNotificationEmail } from '@/lib/propertyRequestMail';
import { sendSms, calculateDistance, budgetRangesOverlap } from '@/utils/sparrowSms';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Maximum distance in kilometers to consider properties as nearby
const MAX_DISTANCE_KM = 5;

export async function POST(request) {
  try {
    const formData = await request.json();
    console.log("Received form data:", formData);

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'propertyType', 'location', 'budget'];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return Response.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate property type specific fields
    if (['Land', 'House'].includes(formData.propertyType) && !formData.area) {
      return Response.json({ error: 'Area is required for Land or House' }, { status: 400 });
    }

    if (formData.propertyType === 'Room/Flat' && (!formData.numberOfRooms || !formData.numberOfPeople)) {
      return Response.json({ error: 'Number of rooms and people required.' }, { status: 400 });
    }

    // Store data in Supabase
    const { data, error } = await supabase
      .from('property_requests')
      .insert([{
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        property_type: formData.propertyType,
        location: formData.location,
        coordinates: formData.coordinates || null,
        budget: formData.budget,
        financing: formData.financing || false,
        area: formData.area || null,
        area_unit: formData.areaUnit || null,
        road_width: formData.roadWidth || null,
        road_width_unit: formData.roadWidthUnit || null,
        number_of_rooms: formData.numberOfRooms || null,
        number_of_people: formData.numberOfPeople || null,
        additional_requirements: formData.additionalRequirements || null
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    // Parse coordinates for the email and SMS matching
    let requestCoordinates = null;
    try {
      if (formData.coordinates) {
        // Handle different formats of coordinates
        if (typeof formData.coordinates === 'string') {
          try {
            requestCoordinates = JSON.parse(formData.coordinates);
          } catch {
            // If parsing fails, try to handle as a string format "lat,lng"
            const parts = formData.coordinates.split(',').map(part => parseFloat(part.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              requestCoordinates = { lat: parts[0], lng: parts[1] };
            }
          }
        } else if (typeof formData.coordinates === 'object' && formData.coordinates !== null) {
          requestCoordinates = formData.coordinates;
        }
      }
    } catch (e) {
      console.warn('Error processing coordinates:', e);
    }

    // Process for email notifications
    let locationDetails = {
      address: formData.location,
      coordinates: requestCoordinates ? `${requestCoordinates.lat}, ${requestCoordinates.lng}` : 'Not provided'
    };

    // Send confirmation email to user
    try {
      const userEmailResult = await sendPropertyRequestConfirmationEmail({
        to: formData.email,
        name: formData.fullName,
        propertyType: formData.propertyType,
        location: formData.location
      });

      if (!userEmailResult.success) {
        console.warn('Warning: Failed to send user confirmation email', userEmailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending user email:', emailError);
      // Continue processing even if user email fails
    }

    // Send notification email to owner/admin with all details including map location
    try {
      const adminEmailResult = await sendPropertyRequestNotificationEmail({
        ...formData,
        locationDetails
      });

      if (!adminEmailResult.success) {
        console.warn('Warning: Failed to send admin notification email', adminEmailResult.error);
      }
    } catch (emailError) {
      console.error('Error sending admin email:', emailError);
      // Continue processing even if admin email fails
    }

    // Find matching properties to send SMS notifications to property owners
    if (requestCoordinates) {
      try {
        console.log('Starting matching process for SMS notifications...');
        console.log('Request coordinates:', requestCoordinates);
        console.log('Property type:', formData.propertyType);
        console.log('Budget:', formData.budget);
        
        // Query listings matching the property type and that are active
        let query = supabase
          .from('listing')
          .select('*, listing_details(*)')
          .eq('active', true);
        
        // Filter by property type if available
        if (formData.propertyType) {
          // Try both potential field names
          query = query.or(`listing_details.property_type.eq.${formData.propertyType},propertyType.eq.${formData.propertyType}`);
        }
        
        const { data: matchingListings, error: listingError } = await query;
        
        if (listingError) {
          console.error('Error fetching matching listings:', listingError);
        } else if (matchingListings && matchingListings.length > 0) {
          console.log(`Found ${matchingListings.length} potential matching listings before filtering`);
          
          // Filter listings by proximity and budget match
          const relevantListings = matchingListings.filter(listing => {
            console.log('\nEvaluating listing:', listing.id);
            
            // Get property type from correct field
            const listingPropertyType = listing.listing_details?.property_type || listing.propertyType;
            console.log('Listing property type:', listingPropertyType);
            console.log('Request property type:', formData.propertyType);
            
            // Property type match
            const propertyTypeMatch = listingPropertyType === formData.propertyType;
            if (!propertyTypeMatch) {
              console.log('Property type mismatch - skipping');
              return false;
            }
            
            // Check if coordinates exist and can be parsed
            let listingCoords;
            try {
              if (typeof listing.coordinates === 'string') {
                listingCoords = JSON.parse(listing.coordinates);
              } else {
                listingCoords = listing.coordinates;
              }
              
              // Validate coordinates
              if (!listingCoords || !listingCoords.lat || !listingCoords.lng) {
                console.log('Invalid listing coordinates - skipping');
                return false;
              }
            } catch (e) {
              console.error('Error parsing listing coordinates:', e);
              return false;
            }
            
            // Calculate distance
            const distance = calculateDistance(requestCoordinates, listingCoords);
            console.log('Distance:', distance.toFixed(2), 'km');
            
            // Price/budget check
            const listingPrice = listing.price || listing.listing_details?.price;
            const listingPriceRange = listing.priceRange || listing.price_range || 
                                     listing.listing_details?.price_range;
            
            console.log('Listing price:', listingPrice);
            console.log('Listing price range:', listingPriceRange);
            console.log('Request budget:', formData.budget);
            
            // Check budget match using price or price range
            const budgetMatch = (listingPrice || listingPriceRange) ? 
              budgetRangesOverlap(formData.budget, listingPriceRange || listingPrice) : false;
            
            console.log('Budget match:', budgetMatch);
            console.log('Distance check:', distance <= MAX_DISTANCE_KM);
            
            // Final match result
            const isMatch = distance <= MAX_DISTANCE_KM && budgetMatch;
            console.log('FINAL MATCH:', isMatch);
            
            return isMatch;
          });
          
          console.log(`Found ${relevantListings.length} relevant listings after filtering`);
          
          // Send SMS to owners of matching properties
          for (const listing of relevantListings) {
            // Fetch owner details
            const ownerEmail = listing.createdBy;
            if (!ownerEmail) {
              console.warn(`No owner email for listing: ${listing.id}`);
              continue;
            }
            
            const { data: ownerData, error: ownerError } = await supabase
              .from('profiles')
              .select('phone')
              .eq('email', ownerEmail)
              .single();
            
            if (ownerError || !ownerData?.phone) {
              console.warn(`Could not find phone number for owner: ${ownerEmail}`);
              continue;
            }
            
            // Create and send SMS
            const message = `New property request matching your listing! ${formData.propertyType} requested in ${formData.location.substring(0, 30)}... Budget: ${formData.budget}. Contact: ${formData.phone}`;
            
            console.log(`Sending SMS notification to ${ownerData.phone}`);
            const smsResult = await sendSms(ownerData.phone, message);
            console.log(`SMS notification result for ${ownerData.phone}:`, smsResult);
          }
        } else {
          console.log('No potential matching listings found');
        }
      } catch (matchingError) {
        console.error('Error in matching and SMS process:', matchingError);
      }
    } else {
      console.log('No coordinates provided for property request - skipping SMS notifications');
    }

    return Response.json({ 
      success: true, 
      message: 'Property request submitted successfully',
      data: data?.[0] || null
    }, { status: 200 });

  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
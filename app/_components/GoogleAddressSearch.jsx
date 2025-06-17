"use client";
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, AlertCircle } from 'lucide-react';

function EnhancedGooglePlacesSearch({ selectedAddress, setCoordinates }) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  // Refs
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const geocoder = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Check API key and initialize services
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY;
    
    if (!apiKey) {
      setError('गुगल प्लेसेस API कुञ्जी फेला परेन / Google Places API key not found in environment variables');
      setDebugInfo('Add NEXT_PUBLIC_GOOGLE_PLACE_API_KEY to your .env.local file');
      return;
    }

    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      try {
        // Initialize all Google services
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        geocoder.current = new window.google.maps.Geocoder();
        
        // Create a dummy div for Places service
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        
        setDebugInfo('Google Maps services initialized successfully');
        console.log('Google Maps loaded:', {
          autocomplete: !!autocompleteService.current,
          places: !!placesService.current,
          geocoder: !!geocoder.current
        });
      } catch (err) {
        setError('Failed to initialize Google Maps services');
        setDebugInfo(`Error: ${err.message}`);
      }
    } else {
      setError('Google Maps not loaded');
      setDebugInfo('Waiting for Google Maps to load...');
    }
  }, []);

  // Enhanced search function with multiple search strategies
  const searchPlaces = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    if (!autocompleteService.current) {
      setError('गुगल प्लेसेस सेवा उपलब्ध छैन / Google Places service not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Strategy 1: Try broad search first (like Google Maps)
      const broadRequest = {
        input: searchQuery,
        componentRestrictions: { country: 'np' },
        // Include ALL types for comprehensive results
        types: [], // Empty means all types
      };

      autocompleteService.current.getPlacePredictions(broadRequest, (predictions, status) => {
        console.log('Broad search result:', { predictions, status });
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
          setPredictions(predictions);
          setIsOpen(true);
          setIsLoading(false);
          setDebugInfo(`Found ${predictions.length} results`);
        } else {
          // Strategy 2: Try with establishment types if no results
          tryEstablishmentSearch(searchQuery);
        }
      });

    } catch (err) {
      setIsLoading(false);
      setError('Search failed: ' + err.message);
      setDebugInfo('Try checking your API key and billing settings');
    }
  };

  // Alternative search for establishments
  const tryEstablishmentSearch = (searchQuery) => {
    const establishmentRequest = {
      input: searchQuery,
      componentRestrictions: { country: 'np' },
      types: ['establishment'],
    };

    autocompleteService.current.getPlacePredictions(establishmentRequest, (predictions, status) => {
      console.log('Establishment search result:', { predictions, status });
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
        setPredictions(predictions);
        setIsOpen(true);
        setIsLoading(false);
        setDebugInfo(`Found ${predictions.length} establishments`);
      } else {
        // Strategy 3: Try geocoding as fallback
        tryGeocodingSearch(searchQuery);
      }
    });
  };

  // Geocoding fallback search
  const tryGeocodingSearch = (searchQuery) => {
    if (!geocoder.current) {
      setIsLoading(false);
      setPredictions([]);
      setDebugInfo('No results found');
      return;
    }

    const geocodeRequest = {
      address: searchQuery + ', Nepal',
      componentRestrictions: { country: 'NP' }
    };

    geocoder.current.geocode(geocodeRequest, (results, status) => {
      console.log('Geocoding result:', { results, status });
      setIsLoading(false);
      
      if (status === 'OK' && results?.length > 0) {
        // Convert geocoding results to prediction format
        const geocodePredictions = results.map((result, index) => ({
          place_id: result.place_id,
          description: result.formatted_address,
          structured_formatting: {
            main_text: result.address_components[0]?.long_name || result.formatted_address,
            secondary_text: result.formatted_address
          },
          types: result.types
        }));
        
        setPredictions(geocodePredictions);
        setIsOpen(true);
        setDebugInfo(`Found ${geocodePredictions.length} locations via geocoding`);
      } else {
        setPredictions([]);
        setIsOpen(false);
        setDebugInfo(`No results found. Status: ${status}`);
      }
    });
  };

  // Debounced input handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setDebugInfo('Searching...');

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search by 500ms (slightly longer for better UX)
    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 500);
  };

  // Enhanced place details fetching
  const getPlaceDetails = (placeId, description) => {
    if (!placesService.current) {
      console.error('Places service not available');
      return;
    }

    setIsLoading(true);
    setDebugInfo('Getting place details...');
    
    const request = {
      placeId: placeId,
      fields: [
        'geometry', 
        'formatted_address', 
        'name', 
        'address_components',
        'place_id',
        'types'
      ]
    };

    placesService.current.getDetails(request, (place, status) => {
      setIsLoading(false);
      console.log('Place details:', { place, status });
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const location = place.geometry.location;
        const coordinates = {
          lat: location.lat(),
          lng: location.lng()
        };

        const addressObj = {
          label: place.formatted_address || description,
          value: {
            place_id: placeId,
            description: description,
            name: place.name,
            types: place.types
          }
        };

        // Update parent components
        selectedAddress(addressObj);
        setCoordinates(coordinates);
        setSelectedPlace(addressObj);
        
        setQuery(place.formatted_address || description);
        setIsOpen(false);
        setPredictions([]);
        setDebugInfo(`Selected: ${place.name || 'Location'}`);
        
        console.log('Final selection:', { addressObj, coordinates });
      } else {
        setError(`Failed to get place details. Status: ${status}`);
        setDebugInfo('Try selecting a different location');
      }
    });
  };

  // Handle place selection
  const handlePlaceSelect = (prediction) => {
    console.log('Selected prediction:', prediction);
    getPlaceDetails(prediction.place_id, prediction.description);
  };

  // Clear selection
  const clearSelection = () => {
    setQuery('');
    setSelectedPlace(null);
    setPredictions([]);
    setIsOpen(false);
    setError(null);
    setDebugInfo('Ready to search');
    selectedAddress(null);
    setCoordinates({ lat: null, lng: null });
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if Google Maps is loaded
  const isGoogleMapsLoaded = typeof window !== 'undefined' && window.google && window.google.maps;

  return (
    <div className='flex flex-col w-full'>
      {/* Main search input */}
      <div className='flex items-stretch w-full relative' ref={inputRef}>
        <div className='flex-shrink-0'>
          <Image 
            src="/pin.png"
            width={43}
            height={43}
            className={`h-full p-1 rounded-l-lg transition-colors ${
              isLoading ? 'bg-yellow-200' : 
              selectedPlace ? 'bg-green-200' : 
              error ? 'bg-red-200' : 
              'bg-purple-200'
            }`}
            alt='Location Pin' 
          />
        </div>

        <div className='flex-grow relative'>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                if (query && predictions.length > 0) {
                  setIsOpen(true);
                }
              }}
              placeholder="नेपालमा कुनै पनि ठाउँ खोज्नुहोस् (जस्तै: रेस्टुरेन्ट, पसल, ठेगाना) / Search any place in Nepal"
              className={`w-full h-[43px] px-3 pr-20 border-t border-r border-b rounded-r-lg focus:outline-none focus:ring-2 transition-colors ${
                error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
              }`}
              disabled={!isGoogleMapsLoaded}
            />
            
            {/* Search/Loading icon */}
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {/* Clear button */}
            {query && (
              <button
                onClick={clearSelection}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dropdown with predictions */}
          {isOpen && predictions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {predictions.map((prediction) => (
                <div
                  key={prediction.place_id}
                  onClick={() => handlePlaceSelect(prediction)}
                  className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                >
                  <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {prediction.structured_formatting?.main_text || prediction.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {prediction.structured_formatting?.secondary_text || 
                       prediction.types?.slice(0, 3).join(', ') || 
                       'नेपालमा स्थान / Location in Nepal'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {isOpen && predictions.length === 0 && query.trim() && !isLoading && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 px-4 py-3">
              <div className="text-sm text-gray-500 text-center">
                कुनै ठाउँ फेला परेन। शहर, स्थान वा व्यवसायको लागि खोज्ने प्रयास गर्नुहोस्।
                <br />No places found. Try searching for cities, landmarks, or businesses.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show only errors, not debug info */}
      {error && (
        <div className="mt-2 px-3 py-2 rounded-md text-xs bg-red-50 text-red-700">
          <AlertCircle className="inline w-3 h-3 mr-1" />
          {error}
        </div>
      )}

      {/* Selected location display */}
      {selectedPlace && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-green-700 font-medium">छानिएको स्थान / Selected Location:</p>
          </div>
          <p className="text-sm text-gray-700 mt-1 ml-4">{selectedPlace.label}</p>
        </div>
      )}

      {/* Loading state for Google Maps */}
      {!isGoogleMapsLoaded && (
        <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-700">
            गुगल म्याप लोड हुँदैछ... कृपया पर्खनुहोस्।
            <br />Loading Google Maps... Please wait.
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedGooglePlacesSearch;
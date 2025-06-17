//@ts-nocheck
"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { MapPin, Home, Building, Leaf, ShoppingBag, Banknote } from 'lucide-react';
import OpenStreetMapSearch from '@/app/_components/OpenStreetMapSearch';
import Link from 'next/link';

const PropertyRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyType: '',
    location: '',
    coordinates: '',
    budget: '',
    financing: false,
    area: '',
    areaUnit: 'Aana',
    roadWidth: '',
    roadWidthUnit: 'Feet',
    numberOfRooms: '',
    numberOfPeople: "",
    additionalRequirements: '',
    agreeToTerms: false
  });

  // Property type options with icons
  const propertyTypes = [
    { key: 'Room/Flat', icon: <Building size={16} className="mr-2" /> },
    { key: 'House', icon: <Home size={16} className="mr-2" /> },
    { key: 'Land', icon: <Leaf size={16} className="mr-2" /> },
    { key: 'Shop', icon: <ShoppingBag size={16} className="mr-2" /> }
  ];
  
  // Budget options aligned with frontend search bar
  const landBudgetOptions = [
    'Under 50 Lakh',
    '50 Lakh - 1 Crore',
    '1 Crore - 2 Crore',
    '2 Crore - 3 Crore',
    '3 Crore - 5 Crore',
    'Above 5 Crore'
  ];

  const roomBudgetOptions = [
    'Under 10K',
    '10K - 20K',
    '20K - 30K',
    '30K - 40K',
    '40K - 60K',
    'Above 60K'
  ];

  const areaUnits = ['Aana', 'Ropani', 'Bigha', 'Kattha', 'Square Feet'];
  
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Enhanced coordinate handling function
  const handleCoordinateSelection = (coords) => {
    // Ensure coordinates are properly formatted and valid
    if (coords && typeof coords === 'object' && coords.lat && coords.lng) {
      // Round to 6 decimal places for consistency
      const formattedCoords = {
        lat: parseFloat(coords.lat.toFixed(6)),
        lng: parseFloat(coords.lng.toFixed(6))
      };
      
      setCoordinates(formattedCoords);
      
      // Also update the coordinates in the form data as a string
      setFormData(prev => ({
        ...prev,
        coordinates: JSON.stringify(formattedCoords)
      }));
      
      console.log('Coordinates selected:', formattedCoords);
    } else {
      console.warn('Invalid coordinates selected:', coords);
    }
  };

  // Enhanced address handling function
  const handleAddressSelection = (selectedValue) => {
    // Process the address value
    const addressDisplay = typeof selectedValue === 'object' && selectedValue !== null
      ? (selectedValue.label || selectedValue.value || JSON.stringify(selectedValue))
      : String(selectedValue);
    
    // Update address state
    setAddress(addressDisplay);
    
    // Update location in form data
    setFormData(prev => ({
      ...prev,
      location: addressDisplay
    }));
    
    console.log('Address selected:', addressDisplay);
  };

  // Show/hide specific form fields based on property type
  const showRoomFields = formData.propertyType === 'Room/Flat';
  const showLandFields = formData.propertyType === 'Land' || formData.propertyType === 'House';
  
  // Handle form submission with improved error handling
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!formData.agreeToTerms) {
  //     toast.error("You must agree to the terms and conditions to proceed.");
  //     return;
  //   }

  //   if (!coordinates.lat || !coordinates.lng) {
  //     toast.error("Please select a valid location from the map.");
  //     return;
  //   }
    
  //   // Additional validations
  //   if (!formData.propertyType) {
  //     toast.error("Please select a property type.");
  //     return;
  //   }
    
  //   if (!formData.budget) {
  //     toast.error("Please select a budget range.");
  //     return;
  //   }
    
  //   setLoading(true);
  //   setError('');
  //   setSuccess(false);
    
  //   try {
  //     // Format coordinates consistently
  //     const formattedCoords = {
  //       lat: parseFloat(coordinates.lat.toFixed(6)),
  //       lng: parseFloat(coordinates.lng.toFixed(6))
  //     };
      
  //     // Prepare submission data
  //     const submitData = {
  //       ...formData,
  //       coordinates: JSON.stringify(formattedCoords),
  //       location: address || formData.location
  //     };
      
  //     console.log('Submitting property request:', submitData);
      
  //     const response = await axios.post('/api/property-request', submitData);
      
  //     if (response.data.success) {
  //       setSuccess(true);
  //       toast.success("Your request has been submitted successfully.");
        
  //       // Reset form
  //       setFormData({
  //         fullName: '',
  //         email: '',
  //         phone: '',
  //         propertyType: '',
  //         location: '',
  //         coordinates: '',
  //         budget: '',
  //         financing: false,
  //         area: '',
  //         areaUnit: 'Aana',
  //         roadWidth: '',
  //         roadWidthUnit: 'Feet',
  //         numberOfRooms: '',
  //         numberOfPeople: "",
  //         additionalRequirements: '',
  //         agreeToTerms: false
  //       });
  //       setAddress('');
  //       setCoordinates({ lat: null, lng: null });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
      
  //     let errorMessage = "There was an error submitting your request. Please try again.";
      
  //     if (error.response && error.response.data && error.response.data.error) {
  //       errorMessage = error.response.data.error;
  //     }
      
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const formattedCoords = {
    lat: parseFloat(coordinates.lat.toFixed(6)),
    lng: parseFloat(coordinates.lng.toFixed(6))
  };

  const payload = {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    propertyType: formData.propertyType,
    location: address || formData.location,
    coordinates: formattedCoords, // Supabase JSONB field
    budget: formData.budget,
    financing: formData.financing,
    area: formData.area || null,
    areaUnit: formData.areaUnit || null,
    roadWidth: formData.roadWidth || null,
    roadWidthUnit: formData.roadWidthUnit || null,
    numberOfRooms: formData.numberOfRooms ? parseInt(formData.numberOfRooms) : null,
    numberOfPeople: formData.numberOfPeople ? parseInt(formData.numberOfPeople) : null,
    additionalRequirements: formData.additionalRequirements || null,
  };

  const { data, error } = await supabase
    .from('requestedProperties')
    .insert([payload]);

  if (error) {
    console.error("Supabase insert error:", error);
    toast.error("Failed to submit. Please try again.");
  } else {
    setSuccess(true);
    toast.success("Your request has been submitted successfully.");
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      propertyType: '',
      location: '',
      coordinates: '',
      budget: '',
      financing: false,
      area: '',
      areaUnit: 'Aana',
      roadWidth: '',
      roadWidthUnit: 'Feet',
      numberOfRooms: '',
      numberOfPeople: "",
      additionalRequirements: '',
      agreeToTerms: false
    });
    setAddress('');
    setCoordinates({ lat: null, lng: null });
  }
} catch (error) {
  console.error("Unexpected error:", error);
  toast.error("An unexpected error occurred.");
}
  }

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white p-6">
        <h1 className="text-2xl font-bold">Property Request Form</h1>
        <p className="text-green-100">Fill out the form to request your desired property</p>
      </div>
      
      {success ? (
        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you for your property request. Our team will contact you soon.</p>
            <Link href="/">
              <button 
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                onClick={() => setSuccess(false)}
              >
                Return Home
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
          {error && (
            <div className="bg-red-100 text-red-700 p-4">
              {error}
            </div>
          )}
          
          {/* Personal Information */}
          <div className="p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Personal Information
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Required</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    required
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    required
                    type="email"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <input
                    required
                    type="tel"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Location */}
          <div className="p-6 relative" style={{ zIndex: 30 }}>
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Location you are looking for
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Required</span>
            </h3>
            
            <div className="mt-4">
              <div className="bg-white rounded-lg border border-gray-300 overflow-visible">
                <div className="w-full">
                  {/* Updated OpenStreetMapSearch component with the new handlers */}
                  <OpenStreetMapSearch
                    selectedAddress={handleAddressSelection}
                    setCoordinates={handleCoordinateSelection}
                  />
                </div>
              </div>
              
              {address && (
                <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                  <div className="flex items-start">
                    <MapPin size={16} className="text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Property Requirements */}
          <div className="p-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Property Requirements
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Required</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  required
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.propertyType}
                  onChange={(e) => handleChange('propertyType', e.target.value)}
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.key}
                    </option>
                  ))}
                </select>
              </div>

              {(formData.propertyType==="Land" || formData.propertyType ==="House") &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <select
                  required
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                >
                  <option value="">Select budget range</option>
                  {landBudgetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              }
              {(formData.propertyType==="Room/Flat" || formData.propertyType ==="Shop") &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <select
                  required
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                >
                  <option value="">Select budget range</option>
                  {roomBudgetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              }
              

            {(formData.propertyType==="House" || formData.propertyType==="Land") &&
            <div className="flex items-center p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
              <label className="flex items-center w-full cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={formData.financing}
                    onChange={(e) => handleChange('financing', e.target.checked)}
                  />
                  <div 
                    className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ease-in-out ${
                      formData.financing ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div 
                    className={`absolute ml-1 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                      formData.financing && 'right-0 mr-1'
                    }`}
                  ></div>
                  </div>
                  
                </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <Banknote size={18} className={`${formData.financing ? 'text-green-500' : 'text-gray-500'} mr-2`} />
                      <span className="text-sm font-medium">Bank Financing</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enable if you need financing options for this property</p>
                  </div>
                  <div className={`ml-auto px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                    formData.financing 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {formData.financing ? "Enabled" : "Disabled"}
                  </div>
              </label>
            </div>
            }

            </div>
            
            {/* Conditional Fields Based on Property Type */}
            {showLandFields && (
              <div className="mt-6">
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h4 className="font-medium text-gray-700 text-sm mb-3">Land Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Land Area</label>
                        <input
                          required
                          type="number"
                          className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter area"
                          value={formData.area}
                          onChange={(e) => handleChange('area', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select
                          className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          value={formData.areaUnit}
                          onChange={(e) => handleChange('areaUnit', e.target.value)}
                        >
                          {areaUnits.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Road Width</label>
                        <input
                          type="number"
                          className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter road width"
                          value={formData.roadWidth}
                          onChange={(e) => handleChange('roadWidth', e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select
                          className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          value={formData.roadWidthUnit}
                          onChange={(e) => handleChange('roadWidthUnit', e.target.value)}
                        >
                          <option value="Feet">Feet</option>
                          <option value="Meter">Meter</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {showRoomFields && (
              <div className="mt-6">
                <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                  <h4 className="font-medium text-gray-700 text-sm mb-3">Room/Flat Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                      <input
                        required
                        type="number"
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter number of rooms"
                        value={formData.numberOfRooms}
                        onChange={(e) => handleChange('numberOfRooms', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected number of people</label>
                      <input
                        required
                        type="number"
                        className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter number of people"
                        value={formData.numberOfPeople}
                        onChange={(e) => handleChange('numberOfPeople', e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
              <textarea
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Please specify any additional requirements or preferences..."
                value={formData.additionalRequirements}
                onChange={(e) => handleChange('additionalRequirements', e.target.value)}
                rows={4}
              ></textarea>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="p-6 bg-gray-50">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
              />
              <span className="text-sm text-gray-700">
                I agree to the <a href="/terms-and-conditions" className="text-green-600 hover:underline">Terms and Conditions</a> and consent to the processing of my personal data as described in the <a href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a>.
              </span>
            </label>
          </div>
          
          {/* Submit Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} transition-colors flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyRequestForm;
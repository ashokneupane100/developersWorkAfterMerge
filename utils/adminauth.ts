"use client";

// Helper functions for admin authentication

// Store admin token in localStorage and as a cookie for middleware
export const setAdminToken = (token:string) => {
  try {
    // Store in localStorage
    localStorage.setItem('adminToken', token);
    
    // Also set as a cookie for server-side middleware
    document.cookie = `adminToken=${token}; path=/; max-age=${8 * 60 * 60}; SameSite=Strict`;
    
    return true;
  } catch (error) {
    console.error('Error setting admin token:', error);
    return false;
  }
};

// Get admin token from localStorage
export const getAdminToken = () => {
  try {
    return localStorage.getItem('adminToken');
  } catch (error) {
    console.error('Error getting admin token:', error);
    return null;
  }
};

// Remove admin token during logout
export const clearAdminToken = () => {
  try {
    localStorage.removeItem('adminToken');
    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Strict';
    return true;
  } catch (error) {
    console.error('Error clearing admin token:', error);
    return false;
  }
};

// Check if user has admin token on client-side
export const hasAdminAccess = () => {
  try {
    const token = localStorage.getItem('adminToken');
    return !!token; // Returns true if token exists
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
};
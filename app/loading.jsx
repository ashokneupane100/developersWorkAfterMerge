import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-6">
                <div>
                  <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Search bar skeleton */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Property cards skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="aspect-video bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex justify-between items-center">
                        <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map skeleton */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-96 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
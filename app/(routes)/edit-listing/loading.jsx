// components/Loading.jsx

import React from 'react';

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white text-gray-700">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
      <p className="text-xl font-semibold">Loading Right Now ...</p>
      <p className="text-sm text-gray-500 mt-2">Please wait while we set things up ...</p>
    </div>
  );
}

export default Loading;

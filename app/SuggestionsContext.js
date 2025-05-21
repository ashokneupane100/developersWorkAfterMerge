import React, { createContext, useContext } from 'react';
import axios from 'axios';

const SuggestionsContext = createContext();

export const useSuggestions = () => {
  return useContext(SuggestionsContext);
};

export const SuggestionsProvider = ({ children }) => {
  const fetchSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get('https://photon.komoot.io/api/', {
          params: { q: query, limit: 5 },
        });
        return response.data.features.filter(
          (feature) => feature.properties.country === 'Nepal'
        );
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
      }
    }
    return [];
  };

  return (
    <SuggestionsContext.Provider value={fetchSuggestions}>
      {children}
    </SuggestionsContext.Provider>
  );
};
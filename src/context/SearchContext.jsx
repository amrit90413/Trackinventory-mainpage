import { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeState, setActiveState] = useState("");
  const [activeCity, setActiveCity] = useState("");

  const clearFilters = () => {
    setSearchQuery("");
    setActiveState("");
    setActiveCity("");
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      activeState,
      setActiveState,
      activeCity,
      setActiveCity,
      clearFilters
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

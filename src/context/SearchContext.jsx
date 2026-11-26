import { createContext, useContext, useState, useEffect } from 'react';
import api from '../composables/instance';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeState, setActiveState] = useState("");
  const [activeCity, setActiveCity] = useState("");
  const [businessDirectoryEnabled, setBusinessDirectoryEnabled] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/Configuration/GetLandingPageSettings', {
      signal: controller.signal,
      timeout: 5000,
    }).then(({ data }) => {
      if (!controller.signal.aborted) {
        setBusinessDirectoryEnabled(data?.businessDirectoryEnabled === true);
      }
    }).catch(() => {
      // Keep cards and their search controls hidden if settings cannot be loaded.
      if (!controller.signal.aborted) setBusinessDirectoryEnabled(false);
    });
    return () => controller.abort();
  }, []);

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
      clearFilters,
      businessDirectoryEnabled
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

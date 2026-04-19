import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Close } from '@mui/icons-material';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const SearchBar = ({ onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCities, setSelectedCities] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        query: searchQuery,
        state: selectedState,
        cities: selectedCities.split(',').map(c => c.trim()).filter(c => c)
      });
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedCities('');
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setShowStateDropdown(false);
  };

  return (
    <>
      {/* Collapsed Search Icon - Desktop */}
      {!isExpanded && (
        <motion.button
          onClick={() => setIsExpanded(true)}
          className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="text-gray-700" sx={{ fontSize: 24 }} />
        </motion.button>
      )}

      {/* Expanded Search Bar - Desktop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="hidden md:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 shadow-sm"
            initial={{ width: 50, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 placeholder-gray-500"
              autoFocus
            />

            {/* State Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStateDropdown(!showStateDropdown)}
                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {selectedState || 'State'}
              </button>
              <AnimatePresence>
                {showStateDropdown && (
                  <motion.div
                    className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-64 overflow-y-auto w-48"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {INDIAN_STATES.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStateSelect(state)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 ${
                          selectedState === state ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cities Input */}
            <input
              type="text"
              placeholder="Cities (comma separated)"
              value={selectedCities}
              onChange={(e) => setSelectedCities(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 placeholder-gray-500 border-l border-gray-300 pl-2"
            />

            {/* Search & Clear Buttons */}
            <button
              onClick={handleSearch}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Close sx={{ fontSize: 18 }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Bar */}
      <motion.div className="md:hidden w-full">
        <motion.form
          onSubmit={handleSearch}
          className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
        >
          <Search className="text-gray-500" sx={{ fontSize: 20 }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500"
          />
        </motion.form>
        {isExpanded && (
          <motion.div
            className="mt-2 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter cities (comma separated)"
              value={selectedCities}
              onChange={(e) => setSelectedCities(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default SearchBar;

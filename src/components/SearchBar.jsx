import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Close } from '@mui/icons-material';
import api from '../composables/instance';
import { useSearch } from '../context/SearchContext';

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const CATEGORY_ICON_MAP = {
  Mobile: "📱", Vehicle: "🚗", Electronics: "💻", Watch: "⌚", Gold: "🪙",
};

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    searchQuery, setSearchQuery,
    activeState, setActiveState,
    activeCity, setActiveCity,
  } = useSearch();

  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const q = debounced.trim();
    if (!q && !activeState && !activeCity) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (q) params.set('search', q);
        if (activeState) params.set('state', activeState);
        if (activeCity) params.set('city', activeCity);
        params.set('take', '8');
        const res = await api.get(`/User/SearchProducts?${params.toString()}`);
        if (!cancelled) setResults(res?.data || null);
      } catch (err) {
        if (!cancelled) setResults({ results: {}, totalResults: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debounced, activeState, activeCity]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [mobileOpen]);

  const hasQuery = Boolean(searchQuery || activeState || activeCity);

  const flatItems = (() => {
    if (!results?.results) return [];
    const out = [];
    Object.entries(results.results).forEach(([cat, catData]) => {
      (catData.items || []).forEach((item) => out.push({ ...item, category: cat }));
    });
    return out.slice(0, 8);
  })();

  const handleNavigate = (item) => {
    if (!item?.websiteName) return;
    setShowDropdown(false);
    setMobileOpen(false);
    if (item.productId) {
      navigate(`/${item.websiteName}/product/${item.productId}`, { state: { product: item } });
    } else {
      navigate(`/${item.websiteName}`);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setActiveState("");
    setActiveCity("");
  };

  const handleViewAll = () => {
    setShowDropdown(false);
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToId: 'business-directory' } });
    } else {
      setTimeout(() => {
        document.getElementById('business-directory')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const ResultsPanel = ({ className = '', maxHeight = 'max-h-96' }) => (
    <div className={`bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden ${className}`}>
      <div className={`${maxHeight} overflow-y-auto`}>
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Searching…</div>
        ) : flatItems.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-3xl mb-1">🔍</div>
            <p className="text-sm text-gray-500">
              {hasQuery ? 'No matching stores found' : 'Start typing to search'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {flatItems.map((item, i) => (
              <li key={item.productId || `${item.websiteName}-${i}`}>
                <button
                  onClick={() => handleNavigate(item)}
                  className="w-full text-left px-3 py-2.5 hover:bg-blue-50 flex items-center gap-3 transition-colors"
                >
                  <span className="text-xl shrink-0">{CATEGORY_ICON_MAP[item.category] || '📦'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name || 'Product'}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.shopName || 'Shop'}
                      {item.city ? ` • ${item.city}` : ''}
                      {item.state ? `, ${item.state}` : ''}
                    </p>
                  </div>
                  {item.price > 0 && (
                    <span className="text-xs font-semibold text-green-600 shrink-0">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {results && results.totalResults > flatItems.length && (
        <button
          onClick={handleViewAll}
          className="w-full text-center py-2.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border-t border-gray-100"
        >
          View all {results.totalResults} results →
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div ref={containerRef} className="hidden md:block flex-1 max-w-2xl mx-4 relative">
        <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-1.5 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search sx={{ fontSize: 20 }} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search shops, products..."
            value={searchQuery}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
            className="flex-1 min-w-0 bg-transparent border-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none py-1.5"
          />
          <div className="hidden lg:flex items-center gap-2 border-l border-gray-200 pl-2 shrink-0">
            <select
              value={activeState}
              onChange={(e) => { setActiveState(e.target.value); setActiveCity(""); setShowDropdown(true); }}
              className="text-xs bg-transparent border-none text-gray-600 focus:outline-none max-w-[120px]"
            >
              <option value="">All States</option>
              {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="text"
              placeholder="City"
              value={activeCity}
              onChange={(e) => { setActiveCity(e.target.value); setShowDropdown(true); }}
              className="w-20 text-xs bg-transparent border-none text-gray-600 placeholder-gray-400 focus:outline-none"
            />
          </div>
          {hasQuery && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
            >
              <Close sx={{ fontSize: 18 }} />
            </button>
          )}
        </div>
        <AnimatePresence>
          {showDropdown && hasQuery && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <ResultsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile — pill trigger between logo and three-dots */}
      <div className="md:hidden flex-1 min-w-0 mx-2">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2 border border-gray-200 text-gray-500 text-sm min-w-0"
          aria-label="Open search"
        >
          <Search sx={{ fontSize: 18 }} className="shrink-0" />
          <span className="truncate text-left">
            {hasQuery
              ? (searchQuery || [activeState, activeCity].filter(Boolean).join(', '))
              : 'Search…'}
          </span>
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 bg-white shadow-xl"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 space-y-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-full px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500">
                    <Search sx={{ fontSize: 20 }} className="text-gray-500 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search shops, products..."
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent border-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear text"
                        className="text-gray-400 p-0.5 shrink-0"
                      >
                        <Close sx={{ fontSize: 18 }} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-blue-600 px-1 shrink-0"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={activeState}
                    onChange={(e) => { setActiveState(e.target.value); setActiveCity(""); }}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white"
                  >
                    <option value="">All States</option>
                    {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={activeCity}
                    onChange={(e) => setActiveCity(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                  />
                </div>
                {hasQuery && (
                  <div className="flex items-center justify-between text-xs">
                    <button onClick={handleClear} className="font-medium text-gray-500 underline">
                      Clear filters
                    </button>
                    <span className="text-gray-500">
                      {loading
                        ? 'Searching…'
                        : results ? `${results.totalResults || 0} result${(results.totalResults || 0) === 1 ? '' : 's'}` : ''}
                    </span>
                  </div>
                )}
              </div>
              {hasQuery && (
                <ResultsPanel
                  className="shadow-none border-0 rounded-none"
                  maxHeight="max-h-[calc(100vh-220px)]"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;

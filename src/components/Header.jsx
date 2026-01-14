import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo-new.jpg';
import { AccountCircle, Menu, Close, PersonAdd, Lock, Person, Logout } from '@mui/icons-material';
import { useAuth } from '../context/auth/useAuth';

const gradientClass = 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
const hoverGradient = 'hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600';

const navItems = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faqs', label: 'FAQs' },
  // { id: 'sign-up', label: 'Sign-up' }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [trialMessage, setTrialMessage] = useState("");
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showTrialTooltip, setShowTrialTooltip] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setTrialMessage("");
      setShowTrialBanner(false);
      setShowTrialModal(false);
      return;
    }

    const resolvedUser = Array.isArray(user) ? user[0] : user;
    if (!resolvedUser) return;

    const {
      isTrial,
      isTrialActive,
      isTrialExpired,
      isSubscribed,
      remainingTrialDays,
    } = resolvedUser;

    if (isTrial && isTrialActive && !isTrialExpired) {
      setTrialMessage(
        `You are left with ${remainingTrialDays ?? 0} days in your free trial.`
      );
      setShowTrialBanner(true);
      setShowTrialModal(false);
      return;
    }

    if (isTrial && isTrialExpired && !isSubscribed) {
      setTrialMessage(
        "Your trial has ended. Please subscribe to continue using Track Inventory."
      );
      setShowTrialBanner(false);
      setShowTrialModal(true);
      return;
    }

    setTrialMessage("");
    setShowTrialBanner(false);
    setShowTrialModal(false);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/?scroll=${sectionId}`);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUserMenuClick = (action) => {
    if (action === 'profile') {
      navigate('/profile');
    } else if (action === 'signup') {
      navigate('/sign-up');
    } else if (action === 'changePassword') {
      navigate('/change-password');
    } else if (action === 'logout') {
      logout();
      navigate('/sign-in');
    }
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };
  const NavLink = ({ item, index, mobile }) => (
    <motion.a
      key={item.id}
      onClick={() => handleNavClick(item.id)}
      className={`group cursor-pointer ${mobile
        ? 'block text-base px-3 py-2 rounded-lg hover:bg-pink-50'
        : 'relative text-base px-3 py-2'
        } text-gray-700 hover:text-pink-600 font-medium transition-all duration-300`}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={mobile ? { x: 10 } : { y: -2 }}
    >
      <span>{item.label}</span>
      {!mobile && (
        <motion.span
          className={`absolute bottom-0 left-0 w-0 h-0.5 ${gradientClass}`}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.a>
  );
  const CTAButton = ({ mobile }) => (
    <motion.button
      className={`group ${gradientClass} ${hoverGradient} text-white ${mobile ? 'w-full text-base py-3' : 'text-sm px-6 py-2'} rounded-full font-semibold transition-all duration-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex items-center justify-center gap-2" onClick={() => navigate('/contact-us')}>
        Contact Us
        <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" whileHover={{ x: 3 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </motion.svg>
      </span>
    </motion.button>
  );

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 ${scrolled
        ? 'bg-white backdrop-blur-xl shadow-lg border-b border-gray-200/50'
        : 'bg-white backdrop-blur-md border-b border-gray-200/30'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:pt-4 sm:pb-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.h1
            className={`text-3xl font-bold bg-clip-text text-transparent cursor-pointer ${gradientClass}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto sm:h-12 md:h-14 lg:h-20 object-contain"
            />
          </motion.h1>
          <nav className="hidden md:flex items-center space-x-6">
            {/* Trial gift icon with hover / focus tooltip */}
            {showTrialBanner && trialMessage && (
              <div
                className="relative"
                onMouseEnter={() => setShowTrialTooltip(true)}
                onMouseLeave={() => setShowTrialTooltip(false)}
              >
                <motion.button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md border border-white/70"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">🎁</span>
                </motion.button>

                {/* Tooltip box shown while hovering the gift icon or tooltip */}
                <AnimatePresence>
                  {showTrialTooltip && (
                    <motion.div
                      className="absolute left-1/2 z-40 mt-3 w-72 -translate-x-1/2"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 shadow-inner shrink-0">
                            <span className="text-lg">🎁</span>
                          </div>
                          <div className="space-y-1 text-left">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                              Trial status
                            </p>
                            <p className="text-xs sm:text-sm leading-snug">
                              {trialMessage}
                            </p>
                            <button
                              className="mt-1 inline-flex items-center text-[15px] font-semibold text-white underline decoration-white/70 hover:decoration-white"
                              onClick={() => navigate('/subscribe')}
                            >
                              View plans
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {navItems.map((item, index) => <NavLink key={index} item={item} index={index} />)}
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative user-menu-container">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AccountCircle sx={{ fontSize: 40 }} />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => handleUserMenuClick('profile')}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center space-x-2 rounded-md"
                    >
                      <Person sx={{ fontSize: 20 }} />
                      <span>Manage Profile</span>
                    </button>
                    <button
                      onClick={() => handleUserMenuClick('signup')}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center space-x-2 rounded-md"
                    >
                      <PersonAdd sx={{ fontSize: 20 }} />
                      <span>Sign Up</span>
                    </button>
                    <button
                      onClick={() => handleUserMenuClick('changePassword')}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center space-x-2 rounded-md"
                    >
                      <Lock sx={{ fontSize: 20 }} />
                      <span>Change Password</span>
                    </button>
                    <button
                      onClick={() => handleUserMenuClick('logout')}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center space-x-2 rounded-md"
                    >
                      <Logout sx={{ fontSize: 20 }} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          </nav>
          <div className="md:hidden">
            <motion.button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-pink-600">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span className="block w-6 h-0.5 bg-current" animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : -2 }} transition={{ duration: 0.3 }} />
                <motion.span className="block w-6 h-0.5 bg-current" animate={{ opacity: isMenuOpen ? 0 : 1 }} transition={{ duration: 0.3 }} />
                <motion.span className="block w-6 h-0.5 bg-current" animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 2 }} transition={{ duration: 0.3 }} />
              </div>
            </motion.button>
          </div>
        </div>

        {/* No full-width banner now; trial status is shown via the gift tooltip icon in the nav */}

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200/50">
                {navItems.map((item, index) => <NavLink key={index} item={item} index={index} mobile />)}
                <div className="pt-4 border-t border-gray-200/50">
                  <button
                    onClick={() => handleUserMenuClick('profile')}
                    className="w-full text-left px-3 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center space-x-2 rounded-lg"
                  >
                    <Person sx={{ fontSize: 20 }} />
                    <span>Manage Profile</span>
                  </button>
                  <button
                    onClick={() => handleUserMenuClick('signup')}
                    className="w-full text-left px-3 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center space-x-2 rounded-lg"
                  >
                    <PersonAdd sx={{ fontSize: 20 }} />
                    <span>Sign Up</span>
                  </button>
                  <button
                    onClick={() => handleUserMenuClick('changePassword')}
                    className="w-full text-left px-3 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200 flex items-center space-x-2 rounded-lg"
                  >
                    <Lock sx={{ fontSize: 20 }} />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={() => handleUserMenuClick('logout')}
                    className="w-full text-left px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center space-x-2 rounded-lg"
                  >
                    <Logout sx={{ fontSize: 20 }} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trial expired modal (blocking) */}
      <AnimatePresence>
        {showTrialModal && trialMessage && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 text-center"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Trial Period Completed
              </h2>
              <p className="text-sm text-gray-700">{trialMessage}</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-md"
                  onClick={() => {
                    setShowTrialModal(false);
                    navigate('/subscribe');
                  }}
                >
                  Subscribe now
                </button>
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setShowTrialModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
export default Header;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo-new.jpg';

const gradientClass = 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
const hoverGradient = 'hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600';

const navItems = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faqs', label: 'FAQs' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id) => {
  if (location.pathname === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    navigate('/', { state: { scrollToId: id } });
  }
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
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item, index) => <NavLink key={index} item={item} index={index} />)}
          </nav>

          {/* <div className="hidden md:flex items-center">
            <CTAButton />
          </div> */}
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
                <div className="pt-4"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
export default Header;
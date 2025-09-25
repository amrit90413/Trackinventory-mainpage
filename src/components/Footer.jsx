import { motion } from 'framer-motion'
import { useState } from 'react';
import { useNavigate } from 'react-router';

const Footer = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const socialVariants = {
    hover: {
      scale: 1.1,
      rotate: 12,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const linkVariants = {
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const handleNavClick = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToId: id } });
    }
    setIsMenuOpen(false);
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-purple-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="col-span-1 md:col-span-2">
          </div>
          <motion.div className="grid grid-cols-2 gap-8 md:col-span-2" variants={itemVariants}>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3 cursor-pointer">
                {[
                  { id: "introduction", label: "Introduction" },
                  { id: "how-it-works", label: "How It Works" },
                  { id: "faqs", label: "FAQs" },
                  { id: "download", label: "Download App" }
                ].map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      className="group text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2"
                      variants={linkVariants}
                      whileHover="hover"
                      onClick={() => handleNavClick(link.id)}
                    >
                      <motion.span
                        className="w-1 h-1 bg-purple-500 rounded-full"
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3">
                {[
                  { path: "/privacy-policy", label: "Privacy Policy" },
                  { path: "/terms-of-service", label: "Terms of Service" },
                ].map((link) => (
                  <li key={link.path}>
                    <span
                      className="flex items-center justify-start gap-2 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        navigate(link.path);
                        window.scrollTo({ top: 0, behavior: "smooth" }); 
                      }}
                    >
                      <motion.span
                        className="w-1.5 h-1.5 bg-pink-500 rounded-full"
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                      {link.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          className="mt-8 text-left space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Phone */}
          <motion.a
            href="tel:7710373130"
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h2.28a1 1 0 01.94.66l1.38 3.7a1 1 0 01-.27 1.1l-1.7 1.7a16 16 0 006.58 6.58l1.7-1.7a1 1 0 011.1-.27l3.7 1.38a1 1 0 01.66.94V19a2 2 0 01-2 2h-1C10.61 21 3 13.39 3 5z"
              />
            </svg>
            <span className="text-sm sm:text-base font-medium">
              7710373130
            </span>
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:SMARTSTOCK33@GMAIL.COM"
            className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 17.25V6.75zm1.72-.53l7.28 5.33 7.28-5.33H3.97z" />
            </svg>
            <motion.span
              className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              SMARTSTOCK33@GMAIL.COM
            </motion.span>
          </motion.a>
        </motion.div>
        <motion.div
          className="border-t border-gray-800 mt-12 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 TrackInventory. All Rights Reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {[
                { path: "/terms-of-service", label: "Terms of Service" },
                { path: "/privacy-policy", label: "Privacy Policy" }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="text-gray-400 hover:text-white text-sm transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
export default Footer
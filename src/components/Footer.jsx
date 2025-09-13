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
    if (location.pathname === '/dashboard') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/dashboard', { state: { scrollToId: id } });
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
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="col-span-1 md:col-span-2">
            <motion.div
              className="mb-6"
              variants={itemVariants}
            >
              <motion.h3
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                TrackInventory
              </motion.h3>
            </motion.div>
            <motion.p
              className="text-gray-400 mb-6 max-w-md leading-relaxed"
              variants={itemVariants}
            >
              Your all-access pass to the most exciting moments in high school sports and arts.
              Capture, share, and earn rewards for showing your school spirit.
            </motion.p>
            <motion.div
              className="flex space-x-4"
              variants={itemVariants}
            >
              {[
                { name: "Facebook", icon: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                { name: "Instagram", icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
                { name: "Twitter", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  variants={socialVariants}
                  whileHover="hover"
                >
                  <span className="sr-only">{social.name}</span>
                  <motion.svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                  </motion.svg>
                </motion.a>
              ))}
            </motion.div>
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
                      onClick={() => navigate(link.path)}
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
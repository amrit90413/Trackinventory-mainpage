import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-icon.png';

const features = [
  { icon: '📦', text: 'Real-time inventory tracking' },
  { icon: '📊', text: 'Live sales & purchase dashboard' },
  { icon: '🔗', text: 'QR code sharing for your store' },
  { icon: '📲', text: 'WhatsApp business notifications' },
];

const AuthLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel — hidden on mobile */}
      <motion.div
        className="hidden lg:flex flex-col justify-between w-[46%] min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0369a1 100%)' }}
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #e0f2fe, transparent)' }} />

        {/* Top: Logo */}
        <div className="relative z-10 p-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <img src={logo} alt="TrackInventory" className="h-12 w-auto" />
          </button>
        </div>

        {/* Middle: Headline + features */}
        <div className="relative z-10 px-10 pb-4">
          <h2 className="text-4xl font-bold text-white leading-tight mb-3">
            Manage your business<br />
            <span className="text-cyan-400">smarter, faster.</span>
          </h2>
          <p className="text-slate-300 text-base mb-10 leading-relaxed">
            The all-in-one inventory platform trusted by thousands of shopkeepers across India.
          </p>
          <ul className="space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-3 text-slate-200 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="text-lg">{f.icon}</span>
                {f.text}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Bottom: Tagline */}
        <div className="relative z-10 px-10 py-8 border-t border-white/10">
          <p className="text-slate-400 text-xs">Trusted by 1000+ businesses across India</p>
        </div>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center px-6 py-10 bg-white min-h-screen"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {/* Mobile-only logo */}
        <button
          onClick={() => navigate('/')}
          className="lg:hidden mb-8 flex items-center gap-2"
        >
          <img src={logo} alt="TrackInventory" className="h-10 w-auto" />
        </button>

        <div className="w-full max-w-md">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{title}</h1>
              {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;

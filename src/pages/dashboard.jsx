import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/useAuth';
import { CircularProgress } from '@mui/material';
import {
  Person, Business, Lock, Payment, Store,
  OpenInNew, Dashboard as DashboardIcon,
} from '@mui/icons-material';
import logo from '../assets/logo-icon.png';

const ADMIN_URL = 'https://trackinventory.in/auth';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const QuickCard = ({ icon, label, desc, onClick, accent = '#2563eb', external }) => (
  <motion.button
    variants={fadeUp}
    onClick={onClick}
    className="group w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="h-1 w-full" style={{ background: accent }} />
    <div className="p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accent}18` }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
          {label}
          {external && <OpenInNew sx={{ fontSize: 13, color: '#94a3b8' }} />}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
      </div>
    </div>
  </motion.button>
);

const StatBadge = ({ label, value, color }) => (
  <div className="flex flex-col items-center bg-white/10 rounded-2xl px-4 py-3 min-w-[80px]">
    <span className="text-2xl font-extrabold text-white">{value}</span>
    <span className="text-[11px] text-white/70 mt-0.5">{label}</span>
  </div>
);

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const resolvedUser = Array.isArray(user) ? user[0] : user;
  const firstName    = resolvedUser?.firstName || resolvedUser?.FirstName || '';
  const lastName     = resolvedUser?.lastName  || resolvedUser?.LastName  || '';
  const email        = resolvedUser?.email     || resolvedUser?.Email     || '';
  const category     = resolvedUser?.serviceName || resolvedUser?.ServiceName || '';
  const bd           = resolvedUser?.bussinessDetail || resolvedUser?.BussinessDetail || [];
  const biz          = Array.isArray(bd) ? bd[0] : bd;
  const bizName      = biz?.name  || biz?.Name  || '';
  const websiteName  = biz?.websiteName || biz?.WebsiteName || '';
  const city         = biz?.city  || biz?.City  || '';
  const state        = biz?.state || biz?.State || '';
  const location     = [city, state].filter(Boolean).join(', ');

  const isTrial          = resolvedUser?.isTrial;
  const isTrialActive    = resolvedUser?.isTrialActive;
  const isTrialExpired   = resolvedUser?.isTrialExpired;
  const isSubscribed     = resolvedUser?.isSubscribed;
  const remainingDays    = resolvedUser?.remainingTrialDays ?? 0;

  const greetHour = new Date().getHours();
  const greeting  = greetHour < 12 ? 'Good morning' : greetHour < 17 ? 'Good afternoon' : 'Good evening';

  if (!token) {
    navigate('/sign-in');
    return null;
  }

  if (!resolvedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress sx={{ color: '#2563eb' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* ── Hero welcome banner ── */}
        <motion.div
          className="relative overflow-hidden rounded-3xl mb-6 shadow-xl"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#0369a1 100%)' }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#38bdf8,transparent)' }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#818cf8,transparent)' }} />

          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {firstName} {lastName}
              </h1>
              {bizName && (
                <p className="text-slate-300 text-sm mt-1 flex items-center gap-1.5">
                  <Store sx={{ fontSize: 16 }} />
                  <span>{bizName}</span>
                  {location && <span className="text-slate-400">· {location}</span>}
                </p>
              )}
              {category && (
                <span className="inline-block mt-2 text-[11px] font-semibold bg-white/15 text-white px-2.5 py-0.5 rounded-full">
                  {category}
                </span>
              )}
            </div>

            {/* Trial / subscription status */}
            {isTrial && isTrialActive && !isTrialExpired && (
              <div className="shrink-0 bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-center">
                <p className="text-white font-bold text-2xl">{remainingDays}</p>
                <p className="text-white/70 text-xs mt-0.5">trial days left</p>
                <button
                  onClick={() => navigate('/subscribe')}
                  className="mt-3 text-xs font-semibold text-cyan-300 hover:text-cyan-100 underline"
                >
                  View plans →
                </button>
              </div>
            )}
            {isSubscribed && (
              <div className="shrink-0 bg-green-500/20 border border-green-400/30 rounded-2xl px-5 py-4 text-center">
                <p className="text-green-300 font-bold text-sm">✓ Subscribed</p>
                <p className="text-white/60 text-xs mt-0.5">Active plan</p>
              </div>
            )}
            {isTrial && isTrialExpired && !isSubscribed && (
              <div className="shrink-0 bg-red-500/20 border border-red-400/30 rounded-2xl px-5 py-4 text-center">
                <p className="text-red-300 font-bold text-sm">Trial ended</p>
                <button
                  onClick={() => navigate('/subscribe')}
                  className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ background: 'linear-gradient(90deg,#ef4444,#dc2626)' }}
                >
                  Subscribe now
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Manage Inventory CTA ── */}
        <motion.a
          href={ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-white border border-blue-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all mb-6 group"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
              <DashboardIcon sx={{ color: 'white', fontSize: 24 }} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">Open Admin Dashboard</p>
              <p className="text-xs text-slate-500 mt-0.5">Manage inventory, sales, purchases & leads</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shrink-0"
            style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}>
            Open <OpenInNew sx={{ fontSize: 16 }} />
          </div>
        </motion.a>

        {/* ── Quick actions grid ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="show"
        >
          <QuickCard
            icon={<Person sx={{ fontSize: 20 }} />}
            label="Manage Profile"
            desc="Update your personal info"
            onClick={() => navigate('/profile')}
            accent="#2563eb"
          />
          {websiteName && (
            <QuickCard
              icon={<Store sx={{ fontSize: 20 }} />}
              label="View My Store"
              desc="See your public inventory page"
              onClick={() => navigate(`/${websiteName}`)}
              accent="#059669"
            />
          )}
          <QuickCard
            icon={<Payment sx={{ fontSize: 20 }} />}
            label="Payment History"
            desc="View past transactions"
            onClick={() => navigate('/payment-history')}
            accent="#7c3aed"
          />
          <QuickCard
            icon={<Lock sx={{ fontSize: 20 }} />}
            label="Change Password"
            desc="Update your login password"
            onClick={() => navigate('/change-password')}
            accent="#0369a1"
          />
          <QuickCard
            icon={<Business sx={{ fontSize: 20 }} />}
            label="Subscription"
            desc="Manage your plan"
            onClick={() => navigate('/subscribe')}
            accent="#ea580c"
          />
        </motion.div>

        {/* ── Store URL quick copy ── */}
        {websiteName && (
          <motion.div
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Your store URL</p>
              <p className="text-sm font-mono text-blue-700 truncate">
                trackinventory.in/{websiteName}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => navigator.clipboard?.writeText(`https://trackinventory.in/${websiteName}`)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
              >
                Copy link
              </button>
              <button
                onClick={() => navigate(`/${websiteName}`)}
                className="px-3 py-2 rounded-xl text-white text-xs font-semibold transition-colors"
                style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}
              >
                Open store
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { Lock, LockOpen, Visibility, VisibilityOff, CheckCircle, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../composables/instance';
import { useAuth } from '../context/auth/useAuth';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all pr-12';

const PasswordField = ({ label, icon, value, onChange, show, onToggle, error }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
        {icon}
      </span>
      <input
        type={show ? 'text' : 'password'}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        className={`${inputCls} pl-10`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
      >
        {show ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
      </button>
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default function ChangePassword() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleShow = (field) => () => setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const validate = () => {
    const e = {};
    if (!formData.oldPassword) e.oldPassword = 'Current password is required';
    if (!formData.newPassword) e.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) e.newPassword = 'Must be at least 6 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.newPassword !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (formData.oldPassword && formData.oldPassword === formData.newPassword)
      e.newPassword = 'Must differ from your current password';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await api.post('/User/ChangePassword',
        { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2500);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to change password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 flex items-start justify-center"
      style={{ background: 'linear-gradient(135deg,#f0f9ff 0%,#f8fafc 100%)' }}>
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowBack sx={{ fontSize: 16 }} /> Back to Profile
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle sx={{ color: '#22c55e', fontSize: 36 }} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Password Changed!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Your password has been updated. Redirecting to your profile…
              </p>
              <motion.button
                onClick={() => navigate('/profile')}
                className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}
                whileHover={{ scale: 1.02 }}
              >
                Go to Profile
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
                <p className="text-slate-500 text-sm mt-1">Keep your account secure with a strong password</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)' }}>
                    <Lock sx={{ color: 'white', fontSize: 18 }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Secure Password Update</p>
                    <p className="text-xs text-slate-400">You'll stay signed in after changing</p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <PasswordField
                    label="Current Password"
                    icon={<LockOpen sx={{ fontSize: 16 }} />}
                    value={formData.oldPassword}
                    onChange={set('oldPassword')}
                    show={show.old}
                    onToggle={toggleShow('old')}
                    error={errors.oldPassword}
                  />
                  <PasswordField
                    label="New Password"
                    icon={<Lock sx={{ fontSize: 16 }} />}
                    value={formData.newPassword}
                    onChange={set('newPassword')}
                    show={show.new}
                    onToggle={toggleShow('new')}
                    error={errors.newPassword}
                  />
                  <PasswordField
                    label="Confirm New Password"
                    icon={<Lock sx={{ fontSize: 16 }} />}
                    value={formData.confirmPassword}
                    onChange={set('confirm')}
                    show={show.confirm}
                    onToggle={toggleShow('confirm')}
                    error={errors.confirmPassword}
                  />

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                    style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Update Password'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../composables/instance';
import AuthLayout from '../../components/AuthLayout';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

const stepTitles = ['Reset Password', 'Check Your Email', 'New Password'];
const stepSubtitles = [
  "We'll send a one-time code to your email.",
  'Enter the OTP we sent to your inbox.',
  'Choose a strong new password.',
];

const ForgotPassword = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSendOtp = async (data) => {
    try {
      setSpinner(true);
      setServerError('');
      setEmail(data.email);
      await api.post('/User/ForgotPassword', { sentTo: data.email, type: 1 }, {
        headers: { 'Content-Type': 'application/json-patch+json' },
      });
      setValue('otp', '');
      setStep(1);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally {
      setSpinner(false);
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      setSpinner(true);
      setServerError('');
      const response = await api.post('/OTP/VerifyOTP', {
        inputotp: data.otp,
        isEmail: true,
        sentTo: email,
      });
      setAccessToken(response.data.accessToken);
      setStep(2);
    } catch (error) {
      setServerError(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setSpinner(false);
    }
  };

  const handleResetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      setServerError('Passwords do not match.');
      return;
    }
    try {
      setSpinner(true);
      setServerError('');
      await api.post('/User/ResetPassword', { Password: data.password }, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      });
      reset();
      navigate('/sign-in');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Reset failed. Try again.');
    } finally {
      setSpinner(false);
    }
  };

  const handlers = [handleSendOtp, handleVerifyOtp, handleResetPassword];

  return (
    <AuthLayout title={stepTitles[step]} subtitle={stepSubtitles[step]}>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[0, 1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s < step
                  ? 'bg-green-500 text-white'
                  : s === step
                  ? 'text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
              style={s === step ? { background: 'linear-gradient(90deg,#2563eb,#06b6d4)' } : {}}
            >
              {s < step ? '✓' : s + 1}
            </div>
            {s < 2 && (
              <div className={`h-0.5 w-8 rounded ${s < step ? 'bg-green-400' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={step}
          onSubmit={handleSubmit(handlers[step])}
          className="space-y-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: 'Email is required' })}
                className={inputCls}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          )}

          {step === 1 && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                One-Time Password
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                {...register('otp', { required: 'OTP is required' })}
                className={inputCls}
              />
              {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
              <p className="text-slate-400 text-xs mt-2">Sent to {email}</p>
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter new password"
                    {...register('password', { required: 'Password is required' })}
                    className={`${inputCls} pr-12`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showPass ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    className={`${inputCls} pr-12`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showConfirm ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {serverError && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {serverError}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={spinner}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {spinner ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              ['Send OTP', 'Verify OTP', 'Reset Password'][step]
            )}
          </motion.button>
        </motion.form>
      </AnimatePresence>

      <p className="text-center mt-6 text-sm text-slate-500">
        <Link to="/sign-in" className="font-semibold text-blue-600 hover:text-blue-700">
          ← Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;

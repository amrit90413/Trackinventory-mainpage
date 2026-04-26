import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../composables/instance';
import { useAuth } from '../../context/auth/useAuth';
import { useToast } from '../../context/toast/ToastContext';
import AuthLayout from '../../components/AuthLayout';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return null;
  }
};

const SignIn = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [spinner, setSpinner] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('password'); // "password" or "otp"
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLoginResponse = (response) => {
    // SuperAdmin app login — OTP verification required before issuing JWT
    if (response.data.otpRequired) {
      navigate('/otp-verify', {
        state: {
          email: response.data.sentTo,
          isEmail: response.data.channel === 'email' ? true : false,
          mode: 'login',
        },
      });
      return;
    }

    const { accessToken, token, user } = response.data ?? {};
    const resolvedToken = accessToken ?? token;
    if (!resolvedToken) throw new Error('Authentication token missing in response.');

    // Decode JWT to get "FirstLogin"
    let firstLogin = 'False';
    const decoded = decodeJwtPayload(resolvedToken);
    if (decoded?.FirstLogin) {
      firstLogin = decoded.FirstLogin;
    }

    login(resolvedToken, user);
    showToast('Login Successful!', 'success');

    if (firstLogin === 'True') {
      navigate('/business-details');
    } else {
      navigate('/dashboard');
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      setSpinner(true);
      const response = await api.post('/User/Login', {
        email: data.emailOrMobile,
        password: data.password,
        source: 2,
      }, { headers: { 'Content-Type': 'application/json-patch+json' } });

      handleLoginResponse(response);
    } catch (error) {
      showToast(error.response?.data?.message || error.response?.data?.error || 'Login failed. Please try again.', 'error');
    } finally {
      setSpinner(false);
    }
  };

  const onSubmitOtp = async (data) => {
    try {
      setSpinner(true);
      const response = await api.post('/User/SendLoginOTP', {
        EmailOrMobile: data.emailOrMobile,
      });

      showToast(response.data.success || 'OTP sent successfully!', 'success');
      navigate('/otp-verify', {
        state: {
          email: response.data.sentTo,
          isEmail: response.data.channel === 'email' ? true : false,
          mode: 'login',
        },
      });
    } catch (error) {
      showToast(error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP.', 'error');
    } finally {
      setSpinner(false);
    }
  };

  const onSubmit = (data) => {
    if (loginMode === 'password') {
      onSubmitPassword(data);
    } else {
      onSubmitOtp(data);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your inventory">
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setLoginMode('password')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            loginMode === 'password'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setLoginMode('otp')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            loginMode === 'otp'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          OTP
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email or Mobile */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Email or Mobile Number
          </label>
          <input
            type="text"
            placeholder="xyz@gmail.com or 9876543210"
            {...register('emailOrMobile', {
              required: 'Email or Mobile Number is required',
            })}
            className={inputCls}
          />
          {errors.emailOrMobile && <p className="text-red-500 text-xs mt-1">{errors.emailOrMobile.message}</p>}
        </div>

        {/* Password */}
        {loginMode === 'password' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
        )}

        {loginMode === 'otp' && (
           <p className="text-center text-xs text-slate-500 mt-2">
             OTP will be sent to your email or WhatsApp
           </p>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={spinner}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {spinner ? <CircularProgress size={20} sx={{ color: 'white' }} /> : (loginMode === 'password' ? 'Sign In' : 'Send OTP')}
        </motion.button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" className="font-semibold text-blue-600 hover:text-blue-700">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;


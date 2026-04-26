import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../../composables/instance';
import { useToast } from '../../context/toast/ToastContext';
import AuthLayout from '../../components/AuthLayout';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

const SignUp = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10,15}$/.test(mobile);

  const onSubmit = async (data) => {
    try {
      setSpinner(true);
      
      const isEmail = validateEmail(data.contact);
      const isMobile = validateMobile(data.contact);

      if (!isEmail && !isMobile) {
        showToast('Please enter a valid email or mobile number', 'error');
        setSpinner(false);
        return;
      }

      const response = await api.post('/User/SignUp', {
        Email: isEmail ? data.contact : undefined,
        MobileNumber: isMobile ? data.contact : undefined,
        FirstName: data.firstName,
        LastName: data.lastName,
        Password: data.password,
        id: '-1',
      });

      if (response.status === 200) {
        showToast('Account created! Please verify OTP.', 'success');
        reset();
        navigate('/otp-verify', { 
          state: { 
            email: data.contact, 
            isEmail: isEmail,
            password: data.password,
            mode: 'signup'
          } 
        });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        showToast('User already exists. Please sign in.', 'error');
      } else {
        showToast(error.response?.data?.message || error.response?.data?.error || 'Signup failed, try again.', 'error');
      }
    } finally {
      setSpinner(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your free 7-day trial — no credit card required">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              {...register('firstName', { required: 'Required' })}
              className={inputCls}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              {...register('lastName', { required: 'Required' })}
              className={inputCls}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email or Mobile */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Email or Mobile Number
          </label>
          <input
            type="text"
            placeholder="xyz@gmail.com or 9876543210"
            {...register('contact', {
              required: 'Email or Mobile is required',
            })}
            className={inputCls}
          />
          {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a secure password"
              {...register('password', { 
                required: 'Password is required',
                pattern: { 
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 
                  message: 'Must include 8+ chars, 1 uppercase, 1 lowercase, and 1 number' 
                }
              })}
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

        <motion.button
          type="submit"
          disabled={spinner}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {spinner ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create Account'}
        </motion.button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;

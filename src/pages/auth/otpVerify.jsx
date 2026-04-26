import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../composables/instance';
import { useAuth } from '../../context/auth/useAuth';
import AuthLayout from '../../components/AuthLayout';
import { useToast } from '../../context/toast/ToastContext';

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-center text-xl tracking-[0.5em] font-bold';

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

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const userEmail = location.state?.email; // "sentTo" email or mobile
  const userPassword = location.state?.password;
  const isEmail = location.state?.isEmail ?? true;
  const mode = location.state?.mode || 'signup';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (!userEmail) {
      showToast('Verification info not found. Please try again.', 'error');
      return;
    }

    try {
      setResendLoading(true);
      setError('');
      const payload = isEmail ? { Email: userEmail } : { MobileNumber: userEmail };
      
      await api.post('/User/ResendOtp', payload);
      
      showToast(isEmail ? 'A new OTP has been sent to your email.' : 'A new OTP has been sent to your WhatsApp.', 'success');
      setOtp('');
      setTimeLeft(60);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setError('Please enter a valid 6-digit OTP.'); return; }
    if (!userEmail) { setError('Verification info missing. Please start over.'); return; }

    try {
      setLoading(true);
      setError('');
      const otpRes = await api.post('/OTP/VerifyOTP', {
        inputotp: otp,
        isEmail: isEmail,
        sentTo: userEmail,
      });

      if (mode === 'login') {
        const responseData = otpRes.data;
        const accessToken = responseData.accessToken;
        
        if (!accessToken) throw new Error('Authentication token missing after OTP verification');
        
        let firstLogin = 'False';
        const decoded = decodeJwtPayload(accessToken);
        if (decoded?.FirstLogin) {
          firstLogin = decoded.FirstLogin;
        }

        // We may not get full user details from verifyOTP, but AuthContext fetchUserDetails will fix it
        login(accessToken, null); 
        showToast('Login Successful!', 'success');
        
        if (firstLogin === 'True') {
          navigate('/business-details');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Signup Flow
        if (otpRes.status === 200) {
          const loginRes = await api.post('/User/Login', {
            email: userEmail,
            password: userPassword,
            source: 2,
          });

          const { accessToken, token, user } = loginRes.data ?? {};
          const resolvedToken = accessToken ?? token;
          if (!resolvedToken) throw new Error('Authentication token missing after OTP verification');

          login(resolvedToken, user);
          navigate('/business-details');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verification"
      subtitle={userEmail ? `We sent a 6-digit code to ${userEmail}` : 'Enter the OTP sent to you.'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mail/Phone icon */}
        <div className="flex justify-center mb-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}
          >
            {isEmail ? '✉️' : '💬'}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 text-center">
            One-Time Password
          </label>
          <input
            type="text"
            placeholder="— — — — — —"
            maxLength={6}
            value={otp}
            onChange={(e) => { 
              const val = e.target.value.replace(/\D/g, '');
              setOtp(val); 
              setError(''); 
            }}
            className={inputCls}
            autoFocus
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(90deg, #2563eb, #06b6d4)' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Verify & Continue'}
        </motion.button>

        <div className="flex flex-col items-center mt-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0 || resendLoading || loading}
            className={`text-sm font-semibold transition-colors ${
              timeLeft > 0 || resendLoading
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {resendLoading ? 'Sending...' : (timeLeft > 0 ? `Resend OTP in ${formatTime(timeLeft)}` : 'Resend OTP')}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          Didn&apos;t receive the code? Check your spam folder.
        </p>
      </form>
    </AuthLayout>
  );
};

export default OtpVerify;

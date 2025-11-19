import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../composables/instance'
const ForgotPassword = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [spinner, setSpinner] = useState(false)
  const handleSendOtp = async (data) => {
    try {
      setSpinner(true)
      setEmail(data.email);
      const payload = { sentTo: data.email, type: 1 };
      await api.post(
        "/User/ForgotPassword",
        payload,
        { headers: { "Content-Type": "application/json-patch+json" } }
      );
      setValue("otp", "");
      setStep(2);
    } catch (error) {
      console.error("Send OTP Error:", error);
    } finally {
      setSpinner(false)
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      setSpinner(true)
      const payload = {
        inputotp: data.otp,
        isEmail: true,
        sentTo: email
      };
      const response = await api.post(
        "/OTP/VerifyOTP",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setAccessToken(response.data.accessToken);
      setStep(3);
    } catch (error) {
      console.error("Verify OTP Error:", error);
      alert(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setSpinner(false)
    }
  };

  const handleResetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      setSpinner(true)
      const payload = {
        Password: data.password
      };
      await api.post(
        "/User/ResetPassword",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );
      reset();
      setStep(1);
      navigate("/sign-in");
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert(error.response?.data?.message || "Reset password failed.");
    } finally {
      setSpinner(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl relative">
        <h1 className="gradient text-3xl sm:text-4xl font-bold text-center pb-6">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h1>
        {step === 1 && (
          <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90"
            >
              {spinner ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("otp", { required: "Please enter OTP" })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Check your email for OTP"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90"
            >
              {spinner ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword", { required: true })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90"
            >
              Reset Password
            </Button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link
            className="text-sm text-purple-600 font-medium hover:underline"
            onClick={() => navigate("/sign-in")}
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

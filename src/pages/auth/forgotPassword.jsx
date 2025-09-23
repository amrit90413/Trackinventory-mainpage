import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleSendOtp = async (data) => {
    try {
      setEmail(data.email); // Save email for next steps
      const payload = { sentTo: data.email, type: 1 };
      console.log("Sending OTP Payload:", payload);

      await axios.post(
        "http://34.131.208.31:7001/api/User/ForgotPassword",
        payload,
        { headers: { "Content-Type": "application/json-patch+json" } }
      );

      alert("OTP sent to your email!");
      setValue("otp", ""); 
      setStep(2);
    } catch (error) {
      console.error("Send OTP Error:", error);
      alert(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      const payload = {
        sentTo: email,
        otp: data.otp,
        type: "1"
      };

      console.log("Verify OTP Payload:", payload);

      await axios.post(
        "http://34.131.208.31:7001/api/OTP/VerifyOTP",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("OTP verified successfully!");
      setStep(3);
    } catch (error) {
      console.error("Verify OTP Error:", error);
      alert(error.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleResetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const payload = { sentTo: email, newPassword: data.password, type: 1 };
      console.log("Reset Password Payload:", payload);

      await axios.post(
        "http://34.131.208.31:7001/api/User/ResetPassword",
        payload,
        { headers: { "Content-Type": "application/json-patch+json" } }
      );

      alert("✅ Password reset successfully! Please log in.");
      reset();
      setStep(1);
      navigate("/");
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert(error.response?.data?.message || "Reset password failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl relative">
        <h1 className="gradient text-3xl sm:text-4xl font-bold text-center pb-6">
          Forgot Password
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
              Send OTP
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
              Verify OTP
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
            className="text-sm text-gray-600 hover:underline"
            onClick={() => navigate("/")}
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

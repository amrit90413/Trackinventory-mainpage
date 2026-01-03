import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import api from "../../composables/instance";
import { useAuth } from "../../context/auth/useAuth";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const userEmail = location.state?.email;
  const userPassword = location.state?.password; // Required for login

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) return alert("Please enter the OTP.");
    if (!userEmail) return alert("Email missing. Please sign up again.");

    try {
      setLoading(true);

      const verifyPayload = {
        inputotp: otp,
        isEmail: true,
        sentTo: userEmail,
      };

      const otpRes = await api.post("/OTP/VerifyOTP", verifyPayload);

      if (otpRes.status === 200) {
        const loginRes = await api.post("/User/Login", {
          email: userEmail,
          password: userPassword,
          source: 2,
        });

        const { accessToken, token, user } = loginRes.data ?? {};
        const resolvedToken = accessToken ?? token;

        if (!resolvedToken) {
          throw new Error("Authentication token missing after OTP verification");
        }

        login(resolvedToken, user);
        navigate("/business-details");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      alert(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-pink-400 before:to-indigo-400 before:opacity-20 before:blur-2xl before:-z-10">

        <h1 className="gradient text-3xl sm:text-4xl font-bold text-center pb-6">
          OTP Verification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-base font-medium mb-1">Enter OTP *</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500"
              placeholder="Enter 6-digit OTP"
            />

            <div className="flex flex-col items-center space-y-3 mt-6">
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500"
              >
                {loading ? "Verifying..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OtpVerify;

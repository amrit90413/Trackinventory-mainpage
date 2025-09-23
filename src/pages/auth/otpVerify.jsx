import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const userEmail = location.state?.email; 

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (!userEmail) {
      alert("No email found. Please go back and sign up again.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        inputotp: otp,
        isEmail: true,
        sentTo: userEmail,
      };

      console.log("Sending OTP Verification Request:", payload);

      const response = await axios.post(
        "https://trackinventory.ddns.net/api/OTP/VerifyOTP",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("OTP Verification Response:", response.data);

      if (response.status === 200) {
        alert(" OTP verified successfully!");
        navigate("/dashboard");
      } else {
        alert(" OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
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

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-base font-medium text-black mb-1">
              Please enter OTP <span className="text-red-500">*</span>
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              placeholder="Enter 6-digit OTP"
            />

            <div className="flex flex-col items-center space-y-3 pt-1 mt-[20px]">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 transition duration-200"
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

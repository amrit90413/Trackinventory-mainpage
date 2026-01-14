import Button from '@mui/material/Button';
import api from '../../composables/instance';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from "../../context/auth/useAuth";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [spinner, setSpinner] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ NEW
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      setSpinner(true);

      const response = await api.post(
        "/User/Login",
        {
          email: data.email,
          password: data.password,
          source: 2,
        },
        {
          headers: {
            "Content-Type": "application/json-patch+json",
          },
        }
      );

      const { accessToken, token, user } = response.data ?? {};
      const resolvedToken = accessToken ?? token;

      if (!resolvedToken) {
        throw new Error("Authentication token missing in response.");
      }

      login(resolvedToken, user);

      toast.success("Login Successful!", {
        autoClose: 3000,
        onClose: () => {
          setSpinner(false);
          navigate("/");
        },
      });

    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setSpinner(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">

        <h1 className="gradient text-3xl font-bold text-center pb-6">
          Sign In
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-base font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with Eye Icon */}
          <div>
            <label className="block text-base font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Please enter your password",
                })}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 
                 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>


          {/* Forgot Password */}
          <div className="text-right">
            <Link
              className="text-sm text-purple-600 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500"
          >
            {spinner ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link
              className="text-purple-600 hover:underline"
              onClick={() => navigate("/sign-up")}
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

import { Button } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://34.131.208.31:7001/api/User/Login", {
        email: data.email,
        password: data.password,
        source: 2,
      }, {
        headers: {
          "Content-Type": "application/json-patch+json", 
        },
      });
      console.log("Login response:", response.data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      alert("Signed in successfully!");
      navigate("/dashboard");
    }
    catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-8 lg:px-16 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200
        shadow-2xl relative before:absolute before:inset-0 before:rounded-2xl 
        before:bg-gradient-to-r before:from-pink-400 before:to-indigo-400 before:opacity-20 
        before:blur-2xl before:-z-10">
        <h1 className="gradient text-3xl sm:text-4xl font-bold text-center pb-6">
          Sign In
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-base font-medium text-black mb-1">
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
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium text-black mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password", { required: "Please enter your password" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right mt-2">
            <Link
              className="text-sm text-purple-600 font-medium hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex flex-col items-center space-y-3 pt-1">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="w-full py-3 text-white font-semibold rounded-lg shadow-md 
              bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
              hover:opacity-90 transition duration-200"
            >
              Sign In
            </Button>
            <p className="text-sm text-black-400">
              Don’t have an account?{" "}
              <Link
                className="text-purple-600 font-medium hover:underline"
                onClick={() => navigate("/sign-up")}
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

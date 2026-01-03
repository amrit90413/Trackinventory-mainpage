import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const otpVerified = localStorage.getItem("otpVerified");

  if (!otpVerified) {
    return <Navigate to="/otp-verify" replace />;
  }

  return children;
};

export default PrivateRoute;

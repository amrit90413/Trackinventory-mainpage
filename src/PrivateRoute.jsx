import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth/useAuth";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;

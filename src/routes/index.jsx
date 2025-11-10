import { createBrowserRouter } from "react-router-dom"; // ✅ must be react-router-dom

import LandingPage from "../pages/landingPage";
import TermsOfServices from "../pages/termsOfServices";
import PrivacyPolicy from "../pages/privacyPolicy";
import SignIn from "../pages/auth/signIn";
import SignUp from "../pages/auth/signUp";
import ForgotPassword from "../pages/auth/forgotPassword";
import BusinessDetails from "../pages/businessDetails";
import OtpVerify from "../pages/auth/otpVerify";
import PrivateRoute from "../PrivateRoute";
import Subscription from "../pages/auth/subscription";
import DeleteAccount from "../pages/deleteAccount"; // ✅ lowercase filename, PascalCase component

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/otp-verify",
    element: <OtpVerify />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServices />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/subscribe",
    element: <Subscription />,
  },
  {
    path: "/delete-account",
    element: <DeleteAccount />, // ✅ correct casing here
  },
  {
    path: "/business-details",
    element: (
      <PrivateRoute>
        <BusinessDetails />
      </PrivateRoute>
    ),
  },
]);

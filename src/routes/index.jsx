import { createBrowserRouter } from "react-router";
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
import Profile from "../pages/profile";
import ChangePassword from "../pages/changePassword";
import PaymentHistory from "../pages/paymentHistory";
import MobileList from "../components/mobileList";
import DeleteAccount from "../pages/deleteAccount"; 
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
    path: "/delete-account",
    element: <DeleteAccount />,
  },
  {
    path:"/subscribe",
    element:<Subscription/>
  },
  {
   path:"/profile", 
   element:<Profile/>
  },
  {
    path: "/change-password",
    element: (
      <PrivateRoute>
        <ChangePassword />
      </PrivateRoute>
    ),
  },
  {
    path: "/business-details",
    element: (
      <PrivateRoute>
        <BusinessDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/payment-history",
    element: (
      <PrivateRoute>
        <PaymentHistory />
      </PrivateRoute>
    ),
  },
  {
    path: "/mobiles",
    element: <MobileList/>,
  },
]);

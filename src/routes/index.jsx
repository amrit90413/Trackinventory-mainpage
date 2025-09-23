import { createBrowserRouter } from "react-router";
import LandingPage from "../pages/landingPage";
import TermsOfServices from "../pages/termsOfServices";
import PrivacyPolicy from "../pages/privacyPolicy";
import SignIn from "../pages/auth/signIn";
import SignUp from "../pages/auth/signUp";
import ForgotPassword from "../pages/auth/forgotPassword";
import BusinessDetails from "../pages/businessDetails";
import OtpVerify from "../pages/auth/otpVerify";
export const routes = createBrowserRouter([
    {
        path: "/",
        element: <SignIn/>
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/otp-verify",
        element:<OtpVerify/>
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/dashboard",
        element: <LandingPage />,
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
        path:"/business-details",
        element:<BusinessDetails/>,
    }
]);
import { createBrowserRouter } from "react-router";
import LandingPage from "../pages/landingPage";
import TermsOfServices from "../pages/termsOfServices";
import PrivacyPolicy from "../pages/privacyPolicy";
import ContactUs from "../pages/conatctUs";
import SignIn from "../pages/auth/signIn";
import SignUp from "../pages/auth/signUp";
import ForgotPassword from "../pages/auth/forgotPassword";
export const routes = createBrowserRouter([
    {
        path:"/",
        element:<LandingPage/>
    },
    {
        path:"/sign-up",
        element:<SignUp/>
    },
     {
        path:"/forgot-password",
        element:<ForgotPassword/>
    },
    {
        path: "/dashboard",
        element:  <LandingPage/>,
    },
    {
        path: "/terms-of-service",
        element: <TermsOfServices/>,
    },
    {
        path: "/privacy-policy",
        element: <PrivacyPolicy/>,
    },
    {
        path:"/contact-us",
        element:<ContactUs/>
    }
]);
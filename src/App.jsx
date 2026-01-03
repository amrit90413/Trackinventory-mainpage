import { RouterProvider } from "react-router";
import { routes } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/auth/AuthContext";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </>
  );
}
export default App;

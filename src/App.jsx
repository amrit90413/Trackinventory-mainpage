import { RouterProvider } from "react-router";
import { routes } from "./routes";
import { AuthProvider } from "./context/auth/AuthContext";
import { ToastProvider } from "./context/toast/ToastContext";

function App() {
  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={routes} />
        </ToastProvider>
      </AuthProvider>
    </>
  );
}
export default App;

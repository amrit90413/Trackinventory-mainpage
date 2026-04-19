import { RouterProvider } from "react-router";
import { routes } from "./routes";
import { AuthProvider } from "./context/auth/AuthContext";
import { ToastProvider } from "./context/toast/ToastContext";
import { SearchProvider } from "./context/SearchContext";

function App() {
  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <SearchProvider>
            <RouterProvider router={routes} />
          </SearchProvider>
        </ToastProvider>
      </AuthProvider>
    </>
  );
}
export default App;

import axios from "axios";
import { getStoredToken } from "../common/storage";

const api = axios.create({
  baseURL: "https://api.trackinventory.in/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Global response interceptor for Paywall / Subscriptions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      console.warn("403 Forbidden: Premium feature locked. Redirecting to subscription page...");
      // Redirect the user to the subscription page
      window.location.href = "/subscribe";
    }
    return Promise.reject(error);
  }
);

export default api;

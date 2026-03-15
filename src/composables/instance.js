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

export default api;

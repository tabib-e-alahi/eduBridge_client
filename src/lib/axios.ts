import axios from "axios";
import { toast } from "sonner";
import { authClient } from "./auth-client";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Request interceptor — ensure credentials on every request
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and 5xx
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      await authClient.signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    if (status && status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;

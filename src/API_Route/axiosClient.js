import axios from "axios";
import { BASE_URL } from "./GlobalRoute";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

let tokenGetter = null;

/**
 * Allows injecting a dynamic token getter (e.g. from Redux store state).
 */
export const setAuthTokenGetter = (getter) => {
  tokenGetter = getter;
};

// Request Interceptor: Automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    let token = null;

    if (tokenGetter) {
      try {
        token = tokenGetter();
      } catch (e) {
        // Fallback to localStorage if getter throws
      }
    }

    if (!token) {
      try {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          token = parsed?.token || parsed?.payLoad?.token;
        }
      } catch (e) {
        // Ignore parse error
      }
    }

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

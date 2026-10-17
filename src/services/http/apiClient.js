import axios from "axios";
import { tokenStorage } from "../storage/tokenStorage";

export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7000/api/v1';

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
        // Fallback to tokenStorage if getter throws
      }
    }

    if (!token) {
      token = tokenStorage.getToken();
    }

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

import axios from "axios";
import apiClient from "./axiosClient";
import store from "../RTK/Store/store";
import { logout } from "../RTK/Auth/AuthSlice";
import { toast } from "react-toastify";

/**
 * Checks whether a JWT token is expired based on its exp timestamp.
 */
export const isTokenExpired = (token) => {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
};

let isHandling401 = false;

/**
 * Configures the global Axios response interceptor to handle 401 Unauthorized status.
 * Automatically clears credentials, shows an alert, and redirects to /login.
 */
export const setupAxiosInterceptors = () => {
  const onResponseError = (error) => {
    const status = error.response ? error.response.status : null;
    const url = error.config ? error.config.url : "";
    const isLoginRequest = url && url.includes("/auth/login");

    if (status === 401 && !isLoginRequest) {
      if (!isHandling401) {
        isHandling401 = true;

        // Clear auth state in Redux and localStorage
        store.dispatch(logout());

        toast.error("انتهت صلاحية الجلسة، برجاء تسجيل الدخول مرة أخرى", {
          toastId: "session-expired",
        });

        // Redirect to login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        setTimeout(() => {
          isHandling401 = false;
        }, 2000);
      }
    }

    return Promise.reject(error);
  };

  axios.interceptors.response.use((response) => response, onResponseError);
  apiClient.interceptors.response.use((response) => response, onResponseError);
};

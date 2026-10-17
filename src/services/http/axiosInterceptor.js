import axios from "axios";
import apiClient from "./apiClient";
import store from "../../store";
import { logout } from "../../features/auth/AuthSlice";
import { toast } from "react-toastify";
import { isTokenExpired } from "../../utils/jwt";

export { isTokenExpired };

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

        // Clear auth state in Redux and storage
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

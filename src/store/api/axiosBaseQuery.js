import apiClient from "../../services/http/apiClient";

/**
 * Custom baseQuery implementation for RTK Query that wraps our centralized Axios client.
 * This guarantees all RTK Query endpoints benefit from:
 * 1. Automatic Authorization token injection via request interceptor.
 * 2. Automatic 401 handling, logout, and redirection via response interceptor.
 * 3. Centralized BASE_URL configuration.
 */
export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method = "GET", data, body, params, headers }) => {
    try {
      const result = await apiClient({
        url: baseUrl + url,
        method,
        data: data || body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;

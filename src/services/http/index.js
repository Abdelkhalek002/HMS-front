import apiClient, { BASE_URL, setAuthTokenGetter } from './apiClient';
import { setupAxiosInterceptors, isTokenExpired } from './axiosInterceptor';

export default apiClient;
export {
  apiClient,
  BASE_URL,
  setAuthTokenGetter,
  setupAxiosInterceptors,
  isTokenExpired,
};

const AUTH_KEY = 'auth';

/**
 * Storage service for managing JWT and authentication state safely.
 */
export const tokenStorage = {
  getAuth() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  getToken() {
    const auth = this.getAuth();
    return auth?.token || auth?.payLoad?.token || null;
  },

  setAuth(data) {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save auth to storage', e);
    }
  },

  clearAuth() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
      console.error('Failed to remove auth from storage', e);
    }
  },
};

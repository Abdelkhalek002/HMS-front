/**
 * Centralized Route Paths Constants
 * Single source of truth for all application routes (Canonical Resource-Based).
 */

export const API_ROUTES = Object.freeze({
  USERS: {
    BASE: '/users',
    BY_ID: (id = ':id') => `/users/${id}`,
    SEND_MESSAGE: (id = ':id') => `/users/${id}/send-message`,
  },
});

export const ROUTES = Object.freeze({
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verify-otp',
    VERIFY_EMAIL: '/verify-email',
    FORGET_PASSWORD: '/forgetpassword',
    FORGET_PASSWORD_OTP: '/forgetpassword/otp',
    FORGET_PASSWORD_NEW: '/forgetpassword/newpassword',
  },
  USER: {
    PROFILE: (userId = ':userId') => `/profile/${userId}`,
    PROFILE_HISTORY: (userId = ':userId') => `/profile/${userId}/history`,
    EDIT_PROFILE: '/editprofile',
    CHANGE_PASSWORD: '/changepassword',
  },
  STAFF: {
    RESERVATIONS: '/reservations',
    RESERVATION_DETAILS: (id = ':id') => `/reservations/${id}`,
    ADMIN_RESERVATION_DETAILS: (id = ':id') => `/admin/reservations/${id}`,
    TRANSFERS: '/transfers',
    USERS: '/users',
    LOGS: '/history',
    ADMINS: '/admins',
    SYSTEM_DATA: '/system-data',
    PROFILE_VIEWER: (userId = ':userId') => `/profile-viewer/${userId}`,
    PROFILE_VIEWER_HISTORY: (userId = ':userId') => `/profile-viewer/${userId}/history`,
  },
  API: API_ROUTES,
  NOT_FOUND: '*',
});

export default ROUTES;

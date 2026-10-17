/**
 * Centralized Route Paths Constants
 * Single source of truth for all application routes.
 */

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
  ADMIN: {
    ROOT: '/ad',
    PROFILE: (userId = ':userId') => `/ad/profile/${userId}`,
    PROFILE_HISTORY: (userId = ':userId') => `/ad/profile/${userId}/history`,
    TRANSFER: '/ad/transfer',
    USERS: '/ad/allusers',
    LOGS: '/ad/history',
    ADMINS: '/ad/admins',
    LEVELS: '/ad/levels',
    CLINICS: '/ad/clinics',
    FACULTIES: '/ad/faculties',
    EX_HOSPITAL: '/ad/exhospital',
    GOVERNORATES: '/ad/governorates',
  },
  COUNTER: {
    ROOT: '/co',
  },
  TRANSFER: {
    ROOT: '/tr',
  },
  NOT_FOUND: '*',
});

export default ROUTES;

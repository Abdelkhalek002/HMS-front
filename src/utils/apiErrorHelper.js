/**
 * Centralized API Error Helper
 * Maps backend error responses to user-friendly messages for the frontend.
 */

/**
 * Normalizes an Axios error into a serializable payload for Redux rejectWithValue.
 * Preserves the HTTP statusCode and all backend response payload fields.
 *
 * @param {import('axios').AxiosError | Error | any} error
 * @returns {object}
 */
export const normalizeApiError = (error) => {
  if (error?.response) {
    const data = error.response.data;
    const statusCode = error.response.status;

    if (typeof data === 'object' && data !== null) {
      return {
        ...data,
        statusCode,
        statusText: error.response.statusText,
      };
    }

    return {
      message: typeof data === 'string' && data.trim() !== '' ? data : error.message,
      statusCode,
      statusText: error.response.statusText,
    };
  }

  return {
    message: error?.message || 'تعذر الاتصال بالخادم، تأكد من اتصال الإنترنت',
    statusCode: null,
  };
};

/**
 * Parses any backend error object or rejected thunk payload and returns
 * a user-friendly message and the HTTP status code.
 *
 * @param {any} error
 * @param {string} defaultFallback
 * @returns {{ message: string, statusCode: number | null }}
 */
export const parseApiError = (
  error,
  defaultFallback = 'حدث خطأ ما، يرجى المحاولة لاحقاً'
) => {
  if (!error) {
    return { message: defaultFallback, statusCode: null };
  }

  // Handle plain string error
  if (typeof error === 'string') {
    return { message: error, statusCode: null };
  }

  // Handle raw Axios error passed directly
  if (error.response) {
    return parseApiError(normalizeApiError(error), defaultFallback);
  }

  // Extract status code
  const statusCode =
    error.statusCode ||
    error.status_code ||
    (typeof error.status === 'number' ? error.status : null) ||
    error.error?.statusCode ||
    null;

  // Rate Limiting (429)
  if (
    statusCode === 429 ||
    error.status === '429' ||
    (typeof error.message === 'string' && error.message.toLowerCase().includes('too many requests'))
  ) {
    return {
      message: 'تجاوزت الحد الأقصى من المحاولات، يرجى المحاولة بعد قليل',
      statusCode: 429,
    };
  }

  // 1. Array of validation errors (e.g. express-validator `errors: [...]`)
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    const formatted = error.errors
      .map((e) => {
        if (typeof e === 'string') return e;
        if (e && typeof e === 'object') return e.msg || e.message || '';
        return '';
      })
      .filter((msg) => msg && msg.trim() !== '')
      .join('، ');

    if (formatted) {
      return { message: formatted, statusCode: statusCode || 400 };
    }
  }

  // 2. Direct message string (e.g. backend ApiError: { status: "fail", message: "..." })
  if (typeof error.message === 'string' && error.message.trim() !== '') {
    // Avoid showing generic technical English messages to users when a fallback is better
    if (error.message === 'Something Went Wrong!') {
      return {
        message: 'حدث خطأ غير متوقع في النظام، يرجى المحاولة لاحقاً',
        statusCode: statusCode || 500,
      };
    }
    return { message: error.message.trim(), statusCode };
  }

  // 3. Alternate property names (msg or error string)
  if (typeof error.msg === 'string' && error.msg.trim() !== '') {
    return { message: error.msg.trim(), statusCode };
  }

  if (typeof error.error === 'string' && error.error.trim() !== '') {
    return { message: error.error.trim(), statusCode };
  }

  if (typeof error.error?.message === 'string' && error.error.message.trim() !== '') {
    return { message: error.error.message.trim(), statusCode };
  }

  // 4. Status code based fallback if no message was provided
  if (statusCode === 409) {
    return { message: 'هذا العنصر مسجل بالفعل في قاعدة البيانات', statusCode: 409 };
  }

  if (statusCode === 404) {
    return { message: 'العنصر المطلوب غير موجود أو تم حذفه', statusCode: 404 };
  }

  if (statusCode === 403) {
    return { message: 'ليس لديك الصلاحية للقيام بهذه العملية', statusCode: 403 };
  }

  if (statusCode === 401) {
    return { message: 'انتهت جلستك، يرجى تسجيل الدخول مرة أخرى', statusCode: 401 };
  }

  return { message: defaultFallback, statusCode };
};

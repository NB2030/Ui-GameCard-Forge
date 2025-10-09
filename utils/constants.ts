export const CACHE_KEYS = {
  OFFLINE_CACHE: 'gamecard-forge-offline-cache',
  USER_TOKEN: 'gamecard-forge-user-token',
  LAST_LICENSE_CHECK: 'gamecard-forge-last-check',
} as const;

export const TIME_CONSTANTS = {
  MAX_OFFLINE_DAYS: 30,
  CACHE_VALIDITY_MS: 24 * 60 * 60 * 1000,
  RETRY_DELAY_MS: 2000,
  MAX_RETRIES: 3,
  LICENSE_CHECK_DEBOUNCE_MS: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
  NO_USER: 'يجب تسجيل الدخول أولاً',
  NO_LICENSE: 'لا يوجد ترخيص نشط',
  LICENSE_EXPIRED: 'انتهت صلاحية الترخيص',
  LICENSE_INVALID: 'الترخيص غير صالح',
  AUTH_FAILED: 'فشلت عملية المصادقة',
  PROFILE_FETCH_ERROR: 'فشل تحميل بيانات الملف الشخصي',
  LICENSE_FETCH_ERROR: 'فشل تحميل بيانات الترخيص',
  OFFLINE_NO_CACHE: 'لا يوجد اتصال بالإنترنت ولا توجد بيانات محفوظة',
  CACHE_EXPIRED: 'انتهت صلاحية البيانات المحفوظة',
} as const;

export const SUCCESS_MESSAGES = {
  LICENSE_ACTIVATED: 'تم تفعيل الترخيص بنجاح',
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح',
  SIGNUP_SUCCESS: 'تم إنشاء الحساب بنجاح',
  LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي بنجاح',
} as const;

export const NETWORK_ERROR_INDICATORS = [
  'Failed to fetch',
  'NetworkError',
  'network',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'net::',
] as const;

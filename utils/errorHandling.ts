import { NETWORK_ERROR_INDICATORS, ERROR_MESSAGES } from './constants';
import { NetworkError } from '../types/auth';

export function isNetworkError(error: any): boolean {
  if (!navigator.onLine) return true;

  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code?.toLowerCase() || '';

  return NETWORK_ERROR_INDICATORS.some(indicator =>
    errorMessage.includes(indicator.toLowerCase()) ||
    errorCode.includes(indicator.toLowerCase())
  );
}

export function createNetworkError(message: string, originalError?: any): NetworkError {
  const error = new Error(message) as NetworkError;
  error.isNetworkError = true;
  error.code = originalError?.code;
  error.cause = originalError;
  return error;
}

export function getErrorMessage(error: any): string {
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function logError(context: string, error: any): void {
  console.error(`[${context}]`, {
    message: error?.message,
    code: error?.code,
    isNetworkError: isNetworkError(error),
    timestamp: new Date().toISOString(),
  });
}

export async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isNetworkError(error) || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

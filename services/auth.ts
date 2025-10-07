import * as api from './api';

const USER_TOKEN_KEY = 'user_token';
const USER_DATA_KEY = 'user_data';

export async function signUp(email: string, password: string, fullName: string) {
  const response = await api.register(email, password, fullName);
  if (response.success && response.token) {
    localStorage.setItem(USER_TOKEN_KEY, response.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
    return response.user;
  }
  throw new Error(response.message || 'Sign up failed');
}

export async function signIn(email: string, password: string) {
  const response = await api.login(email, password);
  if (response.success && response.token) {
    localStorage.setItem(USER_TOKEN_KEY, response.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
    return response.user;
  }
  throw new Error(response.message || 'Sign in failed');
}

export function signOut() {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

export function getUserToken(): string | null {
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function getStoredUser() {
  const userData = localStorage.getItem(USER_DATA_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
      return null;
    }
  }
  return null;
}
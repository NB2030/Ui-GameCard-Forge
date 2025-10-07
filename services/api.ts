const API_BASE_URL = 'https://iwipefxjymkqpsuxkupo.supabase.co/functions/v1/license-service-api';

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An API error occurred.');
  }
  return data;
}

export async function register(email: string, password: string, fullName: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });
  return handleResponse(response);
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function activate(licenseKey: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseKey, token }),
  });
  return handleResponse(response);
}

export async function validate(token: string) {
  const response = await fetch(`${API_BASE_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return handleResponse(response);
}
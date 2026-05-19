export const AUTH_TOKEN_KEY = 'bike360.auth.token';
export const AUTH_USER_KEY = 'bike360.auth.user';

export function saveAuth(authResponse) {
  if (!authResponse?.token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({
    userId: authResponse.userId,
    fullName: authResponse.fullName,
    email: authResponse.email,
    role: authResponse.role,
    expiresAtUtc: authResponse.expiresAtUtc,
  }));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

export function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || '{}');
  } catch {
    return {};
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

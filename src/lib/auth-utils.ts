const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function setUserInfo(user: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUserInfo(): any | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function removeUserInfo(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuth(): void {
  removeAuthToken();
  removeUserInfo();
}

export function generateToken(username: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2);
  return Buffer.from(`${username}:${timestamp}:${randomStr}`).toString('base64');
}

export function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

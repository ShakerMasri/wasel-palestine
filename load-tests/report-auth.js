import http from 'k6/http';
import { check } from 'k6';

export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3000';
}

export function getAuthTokens(baseUrl) {
  const tokenPool = (__ENV.JWT_TOKENS || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokenPool.length > 0) {
    return tokenPool;
  }

  const providedToken = __ENV.JWT_TOKEN;

  if (providedToken && providedToken !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NzcwNDI5MDYsImV4cCI6MTc3NzA0NjUwNn0.rf7rYK_YmjWdTPaOLGITQ1fr3oOJcmzvJoU-v17qO1k') {
    return [providedToken];
  }

  const username = __ENV.AUTH_USERNAME || 'admin';
  const password = __ENV.AUTH_PASSWORD || '123456';

  const loginResponse = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify({ username, password }),
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: '30s',
    },
  );

  const loginOk = check(loginResponse, {
    'login status is 200': (res) => res.status === 200,
  });

  if (!loginOk) {
    throw new Error(
      `Authentication failed. Set JWT_TOKEN env var or valid AUTH_USERNAME/AUTH_PASSWORD. Status=${loginResponse.status}, body=${loginResponse.body}`,
    );
  }

  let payload;
  try {
    payload = loginResponse.json();
  } catch {
    throw new Error('Authentication response is not valid JSON.');
  }

  const token = payload?.access_token || payload?.token;

  if (!token) {
    throw new Error('Authentication response does not include access_token.');
  }

  return [token];
}

export function selectAuthToken(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    throw new Error('No auth tokens available for this VU.');
  }

  return tokens[(__VU - 1) % tokens.length];
}

export function jsonAuthHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
}

export function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  };
}

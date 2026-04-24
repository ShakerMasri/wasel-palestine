import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  authHeaders,
  getAuthTokens,
  getBaseUrl,
  selectAuthToken,
} from './report-auth.js';

const BASE_URL = getBaseUrl();

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export function setup() {
  const tokens = getAuthTokens(BASE_URL);
  return { tokens };
}

export default function (data) {
  const token = selectAuthToken(data.tokens);
  const headers = authHeaders(token);
  const response = http.get(`${BASE_URL}/reports`, headers);

  check(response, {
    'list reports status is 200': (res) => res.status === 200,
    'list reports returns a response body': (res) =>
      res.body && res.body.length > 0,
  });

  sleep(0.5);
}

import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  getAuthTokens,
  getBaseUrl,
  jsonAuthHeaders,
  selectAuthToken,
} from './report-auth.js';

const BASE_URL = getBaseUrl();

export const options = {
  vus: Number(__ENV.CREATE_VUS || 1),
  duration: __ENV.CREATE_DURATION || '3m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<750'],
  },
};

const CREATE_INTERVAL_SECONDS = Number(__ENV.CREATE_INTERVAL_SECONDS || 70);

function buildCreateReportPayload() {
  const suffix = `${Date.now()}-${__VU}-${__ITER}`;

  return JSON.stringify({
    category: 'Road obstruction',
    description: `Crowdsourced reporting load test report ${suffix}`,
    latitude: 31.7683 + (Math.random() - 0.5) / 100,
    longitude: 35.2137 + (Math.random() - 0.5) / 100,
  });
}

export function setup() {
  const tokens = getAuthTokens(BASE_URL);
  return { tokens };
}

export default function (data) {
  const token = selectAuthToken(data.tokens);
  const headers = jsonAuthHeaders(token);
  const response = http.post(
    `${BASE_URL}/reports`,
    buildCreateReportPayload(),
    headers,
  );

  check(response, {
    'create report status is 200 or 201': (res) =>
      res.status === 200 || res.status === 201,
    'create report returns a body': (res) => res.body && res.body.length > 0,
  });

  // API policy allows only 3 creates per 5 minutes per user.
  sleep(CREATE_INTERVAL_SECONDS);
}

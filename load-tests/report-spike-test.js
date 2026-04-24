import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  authHeaders,
  getAuthTokens,
  getBaseUrl,
  jsonAuthHeaders,
  selectAuthToken,
} from './report-auth.js';

const BASE_URL = getBaseUrl();
const CREATE_EVERY_N_ITERS = Number(__ENV.SPIKE_CREATE_EVERY_N || 180);

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '10s', target: 80 },
    { duration: '20s', target: 80 },
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<1000'],
  },
};

function createReportPayload() {
  const suffix = `${Date.now()}-${__VU}-${__ITER}`;

  return JSON.stringify({
    category: 'Spike test report',
    description: `Spike workload report ${suffix}`,
    latitude: 31.75 + (Math.random() - 0.5) / 50,
    longitude: 35.22 + (Math.random() - 0.5) / 50,
  });
}

export function setup() {
  const tokens = getAuthTokens(BASE_URL);
  return { tokens };
}

export default function (data) {
  const token = selectAuthToken(data.tokens);
  const jsonHeaders = jsonAuthHeaders(token);
  const getHeaders = authHeaders(token);

  const shouldCreate = __VU === 1 && __ITER % CREATE_EVERY_N_ITERS === 0;

  if (!shouldCreate) {
    const listResponse = http.get(`${BASE_URL}/reports`, getHeaders);
    check(listResponse, {
      'spike list status is 200': (res) => res.status === 200,
    });
  } else {
    const createResponse = http.post(
      `${BASE_URL}/reports`,
      createReportPayload(),
      jsonHeaders,
    );
    check(createResponse, {
      'spike create status is 200 or 201': (res) =>
        res.status === 200 || res.status === 201,
    });
  }

  sleep(0.2);
}

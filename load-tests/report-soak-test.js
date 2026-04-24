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
const FALLBACK_REPORT_ID = __ENV.REPORT_ID || '';
const CREATE_EVERY_N_ITERS = Number(__ENV.SOAK_CREATE_EVERY_N || 150);

export const options = {
  vus: 8,
  duration: '10m',
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<800'],
  },
};

function buildCreateReportPayload() {
  const suffix = `${Date.now()}-${__VU}-${__ITER}`;

  return JSON.stringify({
    category: 'Soak test report',
    description: `Sustained workload report ${suffix}`,
    latitude: 31.7683 + (Math.random() - 0.5) / 100,
    longitude: 35.2137 + (Math.random() - 0.5) / 100,
  });
}

function extractFirstReportId(response) {
  try {
    const body = response.json();
    if (Array.isArray(body) && body.length > 0) {
      return body[0]?.id ?? null;
    }

    if (Array.isArray(body?.data) && body.data.length > 0) {
      return body.data[0]?.id ?? null;
    }

    return body?.items?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export function setup() {
  const tokens = getAuthTokens(BASE_URL);
  return { tokens };
}

export default function (data) {
  const token = selectAuthToken(data.tokens);
  const jsonHeaders = jsonAuthHeaders(token);
  const getHeaders = authHeaders(token);

  const listResponse = http.get(`${BASE_URL}/reports`, getHeaders);
  check(listResponse, {
    'soak list status is 200': (res) => res.status === 200,
  });

  const reportId = extractFirstReportId(listResponse) || FALLBACK_REPORT_ID;

  if (__VU === 1 && __ITER % CREATE_EVERY_N_ITERS === 0) {
    const createResponse = http.post(
      `${BASE_URL}/reports`,
      buildCreateReportPayload(),
      jsonHeaders,
    );
    check(createResponse, {
      'soak create status is 200 or 201': (res) =>
        res.status === 200 || res.status === 201,
    });
  }

  if (reportId) {
    const detailResponse = http.get(
      `${BASE_URL}/reports/${reportId}`,
      getHeaders,
    );
    check(detailResponse, {
      'soak detail status is 200': (res) => res.status === 200,
    });
  }

  sleep(2);
}

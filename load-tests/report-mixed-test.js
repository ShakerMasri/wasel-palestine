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
const CREATE_EVERY_N_ITERS = Number(__ENV.MIXED_CREATE_EVERY_N || 120);

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '1m', target: 15 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<800'],
  },
};

function buildCreateReportPayload() {
  const suffix = `${Date.now()}-${__VU}-${__ITER}`;

  return JSON.stringify({
    category: 'Checkpoint issue',
    description: `Mixed workload report ${suffix}`,
    latitude: 31.7683 + (Math.random() - 0.5) / 100,
    longitude: 35.2137 + (Math.random() - 0.5) / 100,
  });
}

function extractId(response) {
  try {
    const body = response.json();
    return body?.id ?? body?.report?.id ?? body?.data?.id ?? null;
  } catch {
    return null;
  }
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

  let createResponse = null;
  const shouldCreate = __VU === 1 && __ITER % CREATE_EVERY_N_ITERS === 0;

  if (shouldCreate) {
    createResponse = http.post(
      `${BASE_URL}/reports`,
      buildCreateReportPayload(),
      jsonHeaders,
    );
    check(createResponse, {
      'mixed create status is 200 or 201': (res) =>
        res.status === 200 || res.status === 201,
    });
  }

  const listResponse = http.get(`${BASE_URL}/reports`, getHeaders);
  check(listResponse, {
    'mixed list status is 200': (res) => res.status === 200,
  });

  const reportId =
    (createResponse ? extractId(createResponse) : null) ||
    extractFirstReportId(listResponse) ||
    FALLBACK_REPORT_ID;

  if (reportId) {
    const detailResponse = http.get(
      `${BASE_URL}/reports/${reportId}`,
      getHeaders,
    );
    check(detailResponse, {
      'mixed detail status is 200': (res) => res.status === 200,
    });

    const voteResponse = http.post(
      `${BASE_URL}/reports/${reportId}/vote`,
      JSON.stringify({ vote_type: 'upvote' }),
      jsonHeaders,
    );
    check(voteResponse, {
      'mixed vote status is 200 or 201': (res) =>
        res.status === 200 || res.status === 201,
    });

    const voteSummaryResponse = http.get(
      `${BASE_URL}/reports/${reportId}/votes`,
      getHeaders,
    );
    check(voteSummaryResponse, {
      'mixed vote summary status is 200': (res) => res.status === 200,
    });
  }

  sleep(1);
}

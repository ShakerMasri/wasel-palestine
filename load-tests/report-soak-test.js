import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const JWT_TOKEN = __ENV.JWT_TOKEN || 'YOUR_ACTUAL_JWT_TOKEN_HERE';
const FALLBACK_REPORT_ID = __ENV.REPORT_ID || '';

const HEADERS = {
  headers: {
    Authorization: `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

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

export default function () {
  const listResponse = http.get(`${BASE_URL}/reports`, HEADERS);
  check(listResponse, {
    'soak list status is 200': (res) => res.status === 200,
  });

  const reportId = extractFirstReportId(listResponse) || FALLBACK_REPORT_ID;

  if (__ITER % 25 === 0) {
    const createResponse = http.post(
      `${BASE_URL}/reports`,
      buildCreateReportPayload(),
      HEADERS,
    );
    check(createResponse, {
      'soak create status is 200 or 201': (res) =>
        res.status === 200 || res.status === 201,
    });
  }

  if (reportId) {
    const detailResponse = http.get(`${BASE_URL}/reports/${reportId}`, HEADERS);
    check(detailResponse, {
      'soak detail status is 200': (res) => res.status === 200,
    });
  }

  sleep(2);
}

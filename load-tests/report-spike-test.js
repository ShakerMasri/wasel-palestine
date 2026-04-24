import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const JWT_TOKEN = __ENV.JWT_TOKEN || 'YOUR_ACTUAL_JWT_TOKEN_HERE';

const HEADERS = {
  headers: {
    Authorization: `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

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

export default function () {
  const roll = Math.random();

  if (roll < 0.7) {
    const listResponse = http.get(`${BASE_URL}/reports`, HEADERS);
    check(listResponse, {
      'spike list status is 200': (res) => res.status === 200,
    });
  } else {
    const createResponse = http.post(
      `${BASE_URL}/reports`,
      createReportPayload(),
      HEADERS,
    );
    check(createResponse, {
      'spike create status is 200 or 201': (res) =>
        res.status === 200 || res.status === 201,
    });
  }

  sleep(0.2);
}

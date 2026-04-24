import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const JWT_TOKEN =
  __ENV.JWT_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NzcwMzUyNTIsImV4cCI6MTc3NzAzODg1Mn0.ARU0IgwHCDKdEqGxLe3iMQX2c_8W1000n9BOAFi3CgI';

const HEADERS = {
  headers: {
    Authorization: `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 15 },
    { duration: '30s', target: 25 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<750'],
  },
};

function buildCreateReportPayload() {
  const suffix = `${Date.now()}-${__VU}-${__ITER}`;

  return JSON.stringify({
    category: 'Road obstruction',
    description: `Crowdsourced reporting load test report ${suffix}`,
    latitude: 31.7683 + (Math.random() - 0.5) / 100,
    longitude: 35.2137 + (Math.random() - 0.5) / 100,
  });
}

export default function () {
  const response = http.post(
    `${BASE_URL}/reports`,
    buildCreateReportPayload(),
    HEADERS,
  );

  check(response, {
    'create report status is 201': (res) => res.status === 201,
    'create report returns a body': (res) => res.body && res.body.length > 0,
  });

  sleep(1);
}

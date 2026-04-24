import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const JWT_TOKEN = __ENV.JWT_TOKEN || 'YOUR_ACTUAL_JWT_TOKEN_HERE';

const HEADERS = {
  headers: {
    Authorization: `Bearer ${JWT_TOKEN}`,
    Accept: 'application/json',
  },
};

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/reports`, HEADERS);

  check(response, {
    'list reports status is 200': (res) => res.status === 200,
    'list reports returns a response body': (res) =>
      res.body && res.body.length > 0,
  });

  sleep(0.5);
}

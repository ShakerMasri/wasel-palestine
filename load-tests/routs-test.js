import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const url = 'http://localhost:3000/route-mobility/report';

  const payload = JSON.stringify({
    category: 'Traffic',
    description: 'Load test report',
    latitude: 32.2211,
    longitude: 35.2332,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',

      Authorization: 'Bearer YOUR_ACTUAL_JWT_TOKEN_HERE',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}

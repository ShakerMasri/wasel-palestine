import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50,
  duration: '10s',
};

export default function () {
  const res = http.get('http://localhost:3000/weather/Nablus');

  check(res, {
    'is status 200': (r) => r.status === 200,
    'is fast enough (< 50ms)': (r) => r.timings.duration < 50,
  });

  sleep(0.1);
}

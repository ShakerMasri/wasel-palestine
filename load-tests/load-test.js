import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '10m', target: 50 }, 
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  http.get('http://localhost:3000/incidents');
  sleep(1);
}
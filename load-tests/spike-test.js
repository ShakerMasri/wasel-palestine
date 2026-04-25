import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, 
    { duration: '1m', target: 50 }, 
    { duration: '30s', target: 0 },  
  ],
};

const BASE_URL = 'http://localhost:3000/api/v1'; 
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoic2hha2VyIiwicm9sZSI6IkNpdGl6ZW4iLCJpYXQiOjE3NzcwNjQ1ODAsImV4cCI6MTc3NzE1MDk4MH0.GSsOKHLLTZrLJvfXBsQOdv9Ajqf5D2qBj2ukWYbZME8';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  // 1. جلب الحواجز
  let resCheckpoints = http.get(`${BASE_URL}/checkpoints`, params);
  check(resCheckpoints, { 'Checkpoints status is 200': (r) => r.status === 200 });
  if (resCheckpoints.status !== 200) {
      console.log(`Checkpoints Error: ${resCheckpoints.status} - ${resCheckpoints.body}`);
  }
  
  sleep(1);

  // اختيار رقم حاجز عشوائي بين 1 و 5 لتجنب الـ Database Locks
  // ملاحظة هامة: تأكد أن الأرقام من 1 إلى 5 موجودة فعلاً كـ IDs في جدول الحواجز
  const randomCheckpointId = Math.floor(Math.random() * 5) + 1;

  // 2. إنشاء حادث جديد
  const incidentPayload = JSON.stringify({
    checkpointId: randomCheckpointId,
    status: 'closure',
    description: 'The road is closed due to heavy maintenance.',
    region: 'Ramallah',
    severity: 'High'
  });
  
  let resIncident = http.post(`${BASE_URL}/incidents`, incidentPayload, params);
  check(resIncident, { 'Incident created (201)': (r) => r.status === 201 });
  if (resIncident.status !== 201) {
      console.log(`Incident Error: ${resIncident.status} - ${resIncident.body}`);
  }

  sleep(1);

  // 3. جلب التنبيهات
  let resAlerts = http.get(`${BASE_URL}/alerts/my-subscriptions`, params);
  check(resAlerts, { 'Alerts fetched (200)': (r) => r.status === 200 });
  if (resAlerts.status !== 200) {
      console.log(`Alerts Error: ${resAlerts.status} - ${resAlerts.body}`);
  }

  sleep(1);
}
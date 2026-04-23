import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // البداية بـ 20 مستخدم
    { duration: '1m', target: 50 },  // الوصول لـ 50 مستخدم (Peak)
    { duration: '30s', target: 0 },  // التوقف التدريجي
  ],
};

const BASE_URL = 'http://localhost:3000/api/v1'; // تأكد من وجود /api/v1 إذا فعلتها
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoic2hha2VyIiwicm9sZSI6IkNpdGl6ZW4iLCJpYXQiOjE3NzY5Njg0ODMsImV4cCI6MTc3Njk3MjA4M30.Aid5817fsNe7DGZ2s-JSbRhzCimXeLHCXhCWfqglp4E';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  // 1. اختبار الـ Checkpoints (التي أرسلت كودها الآن)
  // محاكاة قراءة الحواجز (Read-heavy workload)
  let resCheckpoints = http.get(`${BASE_URL}/checkpoints`, params);
  check(resCheckpoints, { 'Checkpoints status is 200': (r) => r.status === 200 });

  sleep(1);

  // 2. اختبار الـ Incidents (Feature 4 - الجزء الأول)
  // إنشاء بلاغ حادث جديد
  const incidentPayload = JSON.stringify({
    checkpointId: 1,
    status: 'closure',
    region: 'Ramallah',
    description: 'Test incident for performance'
  });
  let resIncident = http.post(`${BASE_URL}/incidents`, incidentPayload, params);
  check(resIncident, { 'Incident created (201)': (r) => r.status === 201 });

  sleep(1);

  // 3. اختبار الـ Alerts (Feature 4 - التحقق من وصول التنبيه)
  // التأكد من أن النظام أصدر التنبيه للمستخدمين
  let resAlerts = http.get(`${BASE_URL}/alerts/my-subscriptions`, params);
  check(resAlerts, { 'Alerts fetched (200)': (r) => r.status === 200 });

  sleep(1);
}
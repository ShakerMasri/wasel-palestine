import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

// Configuration
export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 50 },  // Ramp up to 50 users
    { duration: '5m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   
  ],
  thresholds: {
    http_req_failed: ['rate<0.1'], // Error rate should be less than 10%
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_PREFIX = __ENV.API_PREFIX || '/api/v1';
const API_URL = `${BASE_URL}${API_PREFIX}`;

// Test data
const testUser = {
  username: `testuser_${Date.now()}_${__VU}`,
  email: `testuser_${Date.now()}_${__VU}@example.com`,
  password: 'testpass123',
};

const adminCredentials = {
  username: __ENV.ADMIN_USERNAME || 'admin',
  password: __ENV.ADMIN_PASSWORD || '123456',
};

let authToken = '';
let adminAuthToken = '';
let createdReportId = '';
let createdIncidentId = '';
let createdCheckpointId = '';

export function setup() {
  // Register a test user
  const registerResponse = http.post(
    `${API_URL}/auth/register`,
    JSON.stringify(testUser),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(registerResponse, {
    'register successful': (r) => r.status === 201 || r.status === 200,
  });

  // Login to get token
  const loginResponse = http.post(
    `${API_URL}/auth/login`,
    JSON.stringify({
      username: testUser.username,
      password: testUser.password,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  check(loginResponse, {
    'login successful': (r) => r.status === 200,
  });

  if (loginResponse.status === 200) {
    const responseBody = JSON.parse(loginResponse.body);
    authToken = responseBody.access_token || responseBody.token;
  }

  const adminLoginResponse = http.post(
    `${API_URL}/auth/login`,
    JSON.stringify({
      username: adminCredentials.username,
      password: adminCredentials.password,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (adminLoginResponse.status === 200) {
    const responseBody = JSON.parse(adminLoginResponse.body);
    adminAuthToken = responseBody.access_token || responseBody.token;
  }

  return { authToken, adminAuthToken };
}

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export default function (data) {
  const token = data.authToken;
  const adminToken = data.adminAuthToken;

  if (!token) {
    throw new Error('No auth token available from setup');
  }

  let response;

  // Test 1: Root endpoint
  response = http.get(API_URL, {
    headers: getAuthHeaders(token),
  });
  check(response, {
    'root endpoint status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);

  // Test 2: Get all incidents
  response = http.get(`${API_URL}/incidents`, {
    headers: getAuthHeaders(token),
  });
  check(response, {
    'get incidents status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);

  // Test 3: Get all reports (public)
  response = http.get(`${API_URL}/reports`, {
    headers: getAuthHeaders(token),
  });
  check(response, {
    'get reports status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);

  // Test 4: Get all checkpoints
  response = http.get(`${API_URL}/checkpoints`, {
    headers: getAuthHeaders(token),
  });
  check(response, {
    'get checkpoints status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);

  // Test 5: Get weather data (public)
  response = http.get(`${API_URL}/weather/Jerusalem`);
  check(response, {
    'get weather status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);

  // Test 6: External API weather (public)
  response = http.get(`${API_URL}/external-api/weather/Jerusalem`);
  check(response, {
    'get external weather status is 200': (r) => r.status === 200,
  });
  errorRate.add(response.status !== 200);
  responseTime.add(response.timings.duration);

  // Authenticated tests
  if (token) {
    // Test 7: Get profile
    response = http.get(`${API_URL}/auth/profile`, {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'get profile status is 200': (r) => r.status === 200,
    });
    errorRate.add(response.status !== 200);
    responseTime.add(response.timings.duration);

    // Test 8: Create a report
    const reportData = {
      category: 'Road obstruction',
      description: `Load test report ${Date.now()}-${__VU}-${__ITER}`,
      latitude: 31.7683 + (Math.random() - 0.5) / 100,
      longitude: 35.2137 + (Math.random() - 0.5) / 100,
    };

    response = http.post(`${API_URL}/reports`, JSON.stringify(reportData), {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'create report status is 201 or 429': (r) => [200, 201, 429].includes(r.status),
    });
    errorRate.add(response.status !== 201 && response.status !== 200 && response.status !== 429);
    responseTime.add(response.timings.duration);

    if (response.status === 201 || response.status === 200) {
      const createdReport = JSON.parse(response.body);
      createdReportId = createdReport.id || createdReport.report_id || createdReport.reportId;
    }

    // Test 9: Create an incident
    const incidentData = {
      checkpointId: 1,
      status: 'active',
      description: `Load test incident ${Date.now()}-${__VU}-${__ITER}`,
    };

    response = http.post(`${API_URL}/incidents`, JSON.stringify(incidentData), {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'create incident status is 201': (r) => r.status === 201 || r.status === 200,
    });
    errorRate.add(response.status !== 201 && response.status !== 200);
    responseTime.add(response.timings.duration);

    if (response.status === 201 || response.status === 200) {
      const createdIncident = JSON.parse(response.body);
      createdIncidentId = createdIncident.id;
    }

    // Test 10: Create a checkpoint
    const checkpointData = {
      name: `Test Checkpoint ${Date.now()}-${__VU}-${__ITER}`,
      location: 'Test route path',
      latitude: 31.7683 + (Math.random() - 0.5) / 100,
      longitude: 35.2137 + (Math.random() - 0.5) / 100,
      currentStatus: 'active',
    };

    response = http.post(`${API_URL}/checkpoints`, JSON.stringify(checkpointData), {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'create checkpoint status is 201': (r) => r.status === 201 || r.status === 200,
    });
    errorRate.add(response.status !== 201 && response.status !== 200);
    responseTime.add(response.timings.duration);

    if (response.status === 201 || response.status === 200) {
      const createdCheckpoint = JSON.parse(response.body);
      createdCheckpointId = createdCheckpoint.id;
    }

    // Test 11: Subscribe to alerts
    const alertData = {
      region: 'Jerusalem area',
      category: 'Road obstruction',
    };

    response = http.post(`${API_URL}/alerts/subscribe`, JSON.stringify(alertData), {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'subscribe to alerts status is 201': (r) => r.status === 201 || r.status === 200,
    });
    errorRate.add(response.status !== 201 && response.status !== 200);
    responseTime.add(response.timings.duration);

    // Test 12: Get my subscriptions
    response = http.get(`${API_URL}/alerts/my-subscriptions`, {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'get subscriptions status is 200': (r) => r.status === 200,
    });
    errorRate.add(response.status !== 200);
    responseTime.add(response.timings.duration);

    // Test 13: Estimate route
    const routeData = {
      startLatitude: 31.7683,
      startLongitude: 35.2137,
      endLatitude: 31.7783,
      endLongitude: 35.2237,
    };

    response = http.post(`${API_URL}/route-mobility/estimate`, JSON.stringify(routeData), {
      headers: getAuthHeaders(token),
    });
    check(response, {
      'estimate route status is 200 or 201': (r) => [200, 201].includes(r.status),
    });
    errorRate.add(response.status !== 200 && response.status !== 201);
    responseTime.add(response.timings.duration);

    // Test 14: External routing estimate
    response = http.post(`${API_URL}/external-api/routing/estimate`, JSON.stringify(routeData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    check(response, {
      'external routing estimate status is 200 or 201': (r) => [200, 201].includes(r.status),
    });
    errorRate.add(response.status !== 200 && response.status !== 201);
    responseTime.add(response.timings.duration);

    // Test operations on created resources (if they exist)
    if (createdReportId) {
      // Get specific report
      response = http.get(`${API_URL}/reports/${createdReportId}`, {
        headers: getAuthHeaders(token),
      });
      check(response, {
        'get report by id status is 200': (r) => r.status === 200,
      });
      errorRate.add(response.status !== 200);
      responseTime.add(response.timings.duration);

      // Vote on report
      const voteData = { vote_type: 'upvote' };
      response = http.post(`${API_URL}/reports/${createdReportId}/vote`, JSON.stringify(voteData), {
        headers: getAuthHeaders(token),
      });
      check(response, {
        'vote on report status is 201': (r) => r.status === 201 || r.status === 200,
      });
      errorRate.add(response.status !== 201 && response.status !== 200);
      responseTime.add(response.timings.duration);

      // Get report votes
      response = http.get(`${API_URL}/reports/${createdReportId}/votes`, {
        headers: getAuthHeaders(token),
      });
      check(response, {
        'get report votes status is 200': (r) => r.status === 200,
      });
      errorRate.add(response.status !== 200);
      responseTime.add(response.timings.duration);

      // Approve report (admin operation)
      if (adminToken) {
        response = http.patch(`${API_URL}/reports/${createdReportId}/approve`, JSON.stringify({}), {
          headers: getAuthHeaders(adminToken),
        });
        check(response, {
          'approve report status is 200': (r) => r.status === 200,
        });
        errorRate.add(response.status !== 200);
        responseTime.add(response.timings.duration);
      }

      // Get report logs
      response = http.get(`${API_URL}/reports/${createdReportId}/logs`, {
        headers: getAuthHeaders(token),
      });
      check(response, {
        'get report logs status is 200': (r) => r.status === 200,
      });
      errorRate.add(response.status !== 200);
      responseTime.add(response.timings.duration);
    }

    if (createdIncidentId) {
      // Update incident
      const updateData = { status: 'resolved' };
      response = http.patch(`${API_URL}/incidents/${createdIncidentId}`, JSON.stringify(updateData), {
        headers: getAuthHeaders(token),
      });
      check(response, {
        'update incident status is 200': (r) => r.status === 200,
      });
      errorRate.add(response.status !== 200);
      responseTime.add(response.timings.duration);
    }

    if (createdCheckpointId) {
      // Update checkpoint
      const updateCheckpointData = { currentStatus: 'inactive' };
      response = http.patch(`${API_URL}/checkpoints/${createdCheckpointId}`, JSON.stringify(updateCheckpointData), {
        headers: getAuthHeaders(token),
      });
      check(response, {
        'update checkpoint status is 200': (r) => r.status === 200,
      });
      errorRate.add(response.status !== 200);
      responseTime.add(response.timings.duration);
    }
  }

  // Random sleep between 1-3 seconds to simulate real user behavior
  sleep(Math.random() * 2 + 1);
}

export function teardown(data) {
  // Cleanup: Delete created resources if they exist
  const token = data.authToken;

  if (token && createdReportId) {
    http.del(`${API_URL}/reports/${createdReportId}`, null, {
      headers: getAuthHeaders(token),
    });
  }

  if (token && createdIncidentId) {
    http.del(`${API_URL}/incidents/${createdIncidentId}`, null, {
      headers: getAuthHeaders(token),
    });
  }
}
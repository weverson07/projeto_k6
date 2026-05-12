import http from 'k6/http';
import { check, sleep } from 'k6';
import { createClient } from '../../services/httpClient.js';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Gera relatório HTML após o teste

const now = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = `C:\\Users\\HP\\Documents\\k6\\reports\\Report-${now}.html`;

export function handleSummary(data) {
  return {
    [reportPath]: htmlReport(data),
  };
}

export const options = {
  vus: 5,
  duration: '30s',
};

// LOGIN AUTOMÁTICO
function login() {
  const payload =
    'grant_type=password&username=fast_api10@gmail.com&password=teste1234567';

  const res = http.post(
    'http://127.0.0.1:8000/auth/login_token',
    payload,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.json('access_token');
}

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:8000';

  const token = login();

  if (!token) {
    throw new Error('Falha ao obter token no login');
  }

  const getParams = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const postParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.get(`${baseUrl}/users`, getParams);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  const postRes = http.post(
    `${baseUrl}/users/?email=user${Math.random().toString(36).substring(7)}@gmail.com&password=password123&role=user`,
    null,
    postParams
  );

  check(postRes, {
    'status é 201': (r) => r.status === 201,
  });

  const id = postRes.json('id');

  const updateRes = http.put(
    `${baseUrl}/users/${id}`,
    JSON.stringify({
      email: `updated${Math.random().toString(36).substring(7)}@gmail.com`,
      password: 'updated123',
      role: 'admin',
    }),
    postParams
  );

  check(updateRes, {
    'status é 200': (r) => r.status === 200,
  });

  const resGet = http.get(`${baseUrl}/users/${id}`, {
    tags: { expected: '401' },
  }
  );

  check(resGet, {
    'status é 401': (r) => r.status === 401,
  });

  const resDelete = http.del(`${baseUrl}/users/${id}`, null, postParams);

  check(resDelete, {
    'status é 204': (r) => r.status === 204,
  });

  sleep(1);
}
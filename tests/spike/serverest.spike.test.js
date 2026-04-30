import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do teste (SPIKE)
export const options = {
  scenarios: {
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 200,

      stages: [
        { target: 20, duration: '30s' },
        { target: 50, duration: '30s' },
        { target: 100, duration: '30s' },
        { target: 100, duration: '1m' },
        { target: 0, duration: '30s' },
      ],
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://serverest.dev';

// LOGIN (executado por VU - pode otimizar depois com setup())
function login() {
  const payload = JSON.stringify({
    email: 'fulano@qa.com',
    password: 'teste',
  });

  const res = http.post(`${BASE_URL}/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = res.json('authorization');

  check(res, {
    'login 200': (r) => r.status === 200,
    'tem token': () => !!token,
  });

  return token;
}

// Evita cache
function getRandomId() {
  return Math.floor(Math.random() * 1000);
}

export default function () {
  const token = login();

  if (!token) {
    return;
  }

  const params = {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    timeout: '3s',
  };

  const id = getRandomId();

  // FOCO: endpoint principal (mais leve pra carga)
  const res = http.get(`${BASE_URL}/usuarios/${id}`, params);

  check(res, {
    'status 200 ou 400/404': (r) =>
      r.status === 200 || r.status === 400 || r.status === 404,
    'sem timeout': (r) => r.timings.duration < 3000,
  });

  sleep(0.1);
}
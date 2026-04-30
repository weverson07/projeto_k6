import http from 'k6/http';
import { check, sleep } from 'k6';

// STRESS TEST
export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus', // mais adequado para stress
      startVUs: 10,
      stages: [
        { duration: '2m', target: 50 },    // aquece
        { duration: '3m', target: 100 },   // carga média
        { duration: '3m', target: 200 },   // começa stress
        { duration: '3m', target: 400 },   // pressão forte
        { duration: '5m', target: 600 },   // limite real
        { duration: '5m', target: 600 },   // mantém no limite
        { duration: '2m', target: 0 },     // cooldown
      ],
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<3000'], // mais tolerante em stress
    http_req_failed: ['rate<0.1'],     // aceita mais erro
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://serverest.dev';

// 🔥 LOGIN UMA VEZ (correto)
export function setup() {
  const res = http.post(`${BASE_URL}/login`, JSON.stringify({
    email: 'fulano@qa.com',
    password: 'teste',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = res.json('authorization');

  check(res, {
    'login sucesso': (r) => r.status === 200,
  });

  if (!token) {
    throw new Error('Falha no login no setup');
  }

  return { token };
}

// Evita cache
function getRandomId() {
  return Math.floor(Math.random() * 1000);
}

export default function (data) {
  const params = {
    headers: {
      Authorization: data.token,
      'Content-Type': 'application/json',
    },
    timeout: '5s', // stress aceita mais latência
  };

  const id = getRandomId();

  const res = http.get(`${BASE_URL}/usuarios/${id}`, params);

  check(res, {
    'status ok': (r) =>
      r.status === 200 || r.status === 400 || r.status === 404,
    'resposta < 5s': (r) => r.timings.duration < 5000,
  });

  sleep(0.2);
}
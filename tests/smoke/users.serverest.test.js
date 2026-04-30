import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = __ENV.BASE_URL || 'https://serverest.dev';

// LOGIN SERVEREST
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
    'login status 200': (r) => r.status === 200,
    'token recebido': () => !!token,
  });

  return token;
}

export default function () {
  const token = login();

  if (!token) {
    throw new Error('Falha ao obter token');
  }

  const authHeaders = {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };

  // GET usuários
  const res = http.get(`${BASE_URL}/usuarios`, authHeaders);

  check(res, {
    'GET usuarios 200': (r) => r.status === 200,
  });

  // CRIAR usuário
  const email = `user${Math.random().toString(36).substring(7)}@gmail.com`;

  const createRes = http.post(
    `${BASE_URL}/usuarios`,
    JSON.stringify({
      nome: 'Usuário k6',
      email: email,
      password: '123456',
      administrador: 'true',
    }),
    authHeaders
  );

  check(createRes, {
    'POST usuario 201': (r) => r.status === 201,
  });

  const userId = createRes.json('_id');

  // ATUALIZAR usuário
  const updateRes = http.put(
    `${BASE_URL}/usuarios/${userId}`,
    JSON.stringify({
      nome: 'Usuário Atualizado',
      email: `updated${Math.random().toString(36).substring(7)}@gmail.com`,
      password: '654321',
      administrador: 'false',
    }),
    authHeaders
  );

  check(updateRes, {
    'PUT usuario 200': (r) => r.status === 200,
  });

  // BUSCAR usuário
  const getUserRes = http.get(`${BASE_URL}/usuarios/${userId}`);

  check(getUserRes, {
    'GET usuario 200': (r) => r.status === 200,
  });

  // DELETAR usuário
  const deleteRes = http.del(`${BASE_URL}/usuarios/${userId}`, null, authHeaders);

  check(deleteRes, {
    'DELETE usuario 200': (r) => r.status === 200,
  });

  sleep(1);
}
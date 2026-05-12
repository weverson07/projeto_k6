import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import exec from 'k6/execution';

import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

/**
 * ============================================================================
 * TESTE CORPORATIVO AVANÇADO K6
 * ============================================================================
 * Cobertura:
 * - Smoke Test
 * - Load Test
 * - Stress Test
 * - Spike Test
 * - Soak Test
 * - Performance Baseline
 * - Thresholds avançados
 * - Métricas customizadas
 * - Relatório HTML
 * - Logs corporativos
 * - Token compartilhado
 * - Randomização
 * - Tags
 * - SLA
 * ============================================================================
 */

/**
 * ============================================================================
 * CONFIGURAÇÕES
 * ============================================================================
 */

const BASE_URL = __ENV.BASE_URL || 'https://serverest.dev';

const now = new Date().toISOString().replace(/[:.]/g, '-');

const REPORT_PATH =
  `C:\\Users\\HP\\Documents\\k6\\reports\\Advanced-Report-${now}.html`;

/**
 * ============================================================================
 * MÉTRICAS CUSTOMIZADAS
 * ============================================================================
 */

const errorRate = new Rate('errors');

const loginDuration = new Trend('login_duration');

const usersDuration = new Trend('users_duration');

const productsDuration = new Trend('products_duration');

const customRequests = new Counter('custom_requests');

/**
 * ============================================================================
 * OPTIONS
 * ============================================================================
 */

export const options = {

  discardResponseBodies: false,

  scenarios: {

    /**
     * ==========================================================
     * SMOKE TEST
     * ==========================================================
     */

    smoke_test: {

      executor: 'constant-vus',

      vus: 1,

      duration: '30s',

      exec: 'smokeScenario',

      tags: {
        test_type: 'smoke',
      },
    },

    /**
     * ==========================================================
     * LOAD TEST
     * ==========================================================
     */

    load_test: {

      executor: 'ramping-vus',

      startVUs: 10,

      stages: [

        { duration: '2m', target: 50 },

        { duration: '5m', target: 100 },

        { duration: '5m', target: 100 },

        { duration: '2m', target: 0 },

      ],

      gracefulRampDown: '30s',

      exec: 'loadScenario',

      tags: {
        test_type: 'load',
      },
    },

    /**
     * ==========================================================
     * STRESS TEST
     * ==========================================================
     */

    stress_test: {

      executor: 'ramping-vus',

      startVUs: 50,

      stages: [

        { duration: '2m', target: 100 },

        { duration: '3m', target: 300 },

        { duration: '3m', target: 500 },

        { duration: '5m', target: 800 },

        { duration: '5m', target: 800 },

        { duration: '2m', target: 0 },

      ],

      gracefulRampDown: '30s',

      exec: 'stressScenario',

      tags: {
        test_type: 'stress',
      },
    },

    /**
     * ==========================================================
     * SPIKE TEST
     * ==========================================================
     */

    spike_test: {

      executor: 'ramping-vus',

      startVUs: 10,

      stages: [

        { duration: '30s', target: 20 },

        { duration: '30s', target: 1000 },

        { duration: '1m', target: 1000 },

        { duration: '30s', target: 20 },

      ],

      exec: 'spikeScenario',

      tags: {
        test_type: 'spike',
      },
    },

    /**
     * ==========================================================
     * SOAK TEST
     * ==========================================================
     */

    soak_test: {

      executor: 'constant-vus',

      vus: 100,

      duration: '30m',

      exec: 'soakScenario',

      tags: {
        test_type: 'soak',
      },
    },
  },

  /**
   * ==========================================================================
   * THRESHOLDS / SLA
   * ==========================================================================
   */

  thresholds: {

    http_req_failed: [
      'rate<0.05',
    ],

    http_req_duration: [
      'p(95)<2000',
      'p(99)<4000',
    ],

    checks: [
      'rate>0.95',
    ],

    login_duration: [
      'p(95)<1000',
    ],

    users_duration: [
      'p(95)<1500',
    ],

    products_duration: [
      'p(95)<1500',
    ],
  },

  /**
   * ==========================================================================
   * PERFORMANCE
   * ==========================================================================
   */

  noConnectionReuse: false,

  userAgent: 'K6-Corporate-Performance-Test',

  insecureSkipTLSVerify: true,
};

/**
 * ============================================================================
 * LOGIN GLOBAL
 * ============================================================================
 */

export function setup() {

  console.log('Iniciando setup global...');

  const payload = JSON.stringify({
    email: 'fulano@qa.com',
    password: 'teste',
  });

  const params = {

    headers: {
      'Content-Type': 'application/json',
    },

    timeout: '10s',
  };

  const response = http.post(
    `${BASE_URL}/login`,
    payload,
    params
  );

  loginDuration.add(response.timings.duration);

  const success = check(response, {

    'LOGIN - status 200': (r) => r.status === 200,

    'LOGIN - token gerado': (r) =>
      r.json('authorization') !== undefined,

  });

  errorRate.add(!success);

  const token = response.json('authorization');

  if (!token) {
    throw new Error('Falha crítica ao gerar token');
  }

  return {
    token,
  };
}

/**
 * ============================================================================
 * HELPERS
 * ============================================================================
 */

function randomUserId() {
  return Math.floor(Math.random() * 1000);
}

function buildHeaders(token) {

  return {

    headers: {

      Authorization: token,

      'Content-Type': 'application/json',
    },

    timeout: '10s',
  };
}

/**
 * ============================================================================
 * CORE REQUESTS
 * ============================================================================
 */

function getUsers(token) {

  group('GET USERS', () => {

    const id = randomUserId();

    const response = http.get(
      `${BASE_URL}/usuarios/${id}`,
      buildHeaders(token)
    );

    usersDuration.add(response.timings.duration);

    customRequests.add(1);

    const success = check(response, {

      'USERS - status válido': (r) =>
        [200, 400, 404].includes(r.status),

      'USERS - resposta < 2s': (r) =>
        r.timings.duration < 2000,

      'USERS - body não vazio': (r) =>
        r.body.length > 0,
    });

    errorRate.add(!success);
  });
}

function getProducts(token) {

  group('GET PRODUCTS', () => {

    const response = http.get(
      `${BASE_URL}/produtos`,
      buildHeaders(token)
    );

    productsDuration.add(response.timings.duration);

    customRequests.add(1);

    const success = check(response, {

      'PRODUCTS - status 200': (r) =>
        r.status === 200,

      'PRODUCTS - resposta < 2s': (r) =>
        r.timings.duration < 2000,

    });

    errorRate.add(!success);
  });
}

/**
 * ============================================================================
 * SCENARIOS
 * ============================================================================
 */

export function smokeScenario(data) {

  getUsers(data.token);

  sleep(1);
}

export function loadScenario(data) {

  getUsers(data.token);

  getProducts(data.token);

  sleep(1);
}

export function stressScenario(data) {

  getUsers(data.token);

  getProducts(data.token);

  sleep(0.3);
}

export function spikeScenario(data) {

  getUsers(data.token);

  sleep(0.1);
}

export function soakScenario(data) {

  getUsers(data.token);

  getProducts(data.token);

  sleep(2);
}

/**
 * ============================================================================
 * TEARDOWN
 * ============================================================================
 */

export function teardown(data) {

  console.log('Finalizando execução...');

  console.log(`VU final: ${exec.vu.idInTest}`);
}

/**
 * ============================================================================
 * RELATÓRIO HTML
 * ============================================================================
 */

export function handleSummary(data) {

  return {

    [REPORT_PATH]: htmlReport(data, {

      title: 'K6 Advanced Corporate Performance Report',

    }),

    stdout: `
=========================================
K6 CORPORATE TEST FINISHED
=========================================

TOTAL REQUESTS: ${data.metrics.http_reqs.values.count}

ERROR RATE:
${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%

P95:
${data.metrics.http_req_duration.values['p(95)']} ms

P99:
${data.metrics.http_req_duration.values['p(99)']} ms

=========================================
`,
  };
}
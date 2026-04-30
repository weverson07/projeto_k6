// // const fs = require('fs');

// // const summary = JSON.parse(fs.readFileSync('summary.json', 'utf-8'));
// // const metrics = summary.metrics || {};

// // // =======================
// // // HELPERS (OBRIGATÓRIO)
// // // =======================

// // function getCount(name) {
// //   return metrics[name]?.count ?? 0;
// // }

// // function getAvg(name) {
// //   return metrics[name]?.avg ? metrics[name].avg.toFixed(2) : 0;
// // }

// // function getP95(name) {
// //   return metrics[name]?.['p(95)']
// //     ? metrics[name]['p(95)'].toFixed(2)
// //     : 0;
// // }

// // function getRate(name) {
// //   return metrics[name]?.value
// //     ? (metrics[name].value * 100).toFixed(2) + '%'
// //     : '0%';
// // }

// // // =======================
// // // HTML
// // // =======================

// // const html = `
// // <!DOCTYPE html>
// // <html lang="pt-br">
// // <head>
// // <meta charset="UTF-8">
// // <title>k6 Report</title>

// // <style>
// //   body {
// //     font-family: Arial;
// //     background: #0b1220;
// //     color: white;
// //     margin: 0;
// //     padding: 20px;
// //   }

// //   h1 {
// //     color: #38bdf8;
// //   }

// //   .grid {
// //     display: grid;
// //     grid-template-columns: repeat(3, 1fr);
// //     gap: 15px;
// //     margin-top: 20px;
// //   }

// //   .card {
// //     background: #111827;
// //     padding: 20px;
// //     border-radius: 10px;
// //     text-align: center;
// //   }

// //   .value {
// //     font-size: 28px;
// //     font-weight: bold;
// //     color: #22c55e;
// //   }

// //   .label {
// //     font-size: 14px;
// //     color: #94a3b8;
// //   }

// //   pre {
// //     background: #0f172a;
// //     padding: 15px;
// //     border-radius: 10px;
// //     margin-top: 30px;
// //     overflow: auto;
// //   }
// // </style>
// // </head>

// // <body>

// // <h1>📊 k6 Performance Report</h1>

// // <div class="grid">

// //   <div class="card">
// //     <div class="value">${getCount('http_reqs')}</div>
// //     <div class="label">Requisições</div>
// //   </div>

// //   <div class="card">
// //     <div class="value">${getAvg('http_req_duration')} ms</div>
// //     <div class="label">Latência média</div>
// //   </div>

// //   <div class="card">
// //     <div class="value">${getRate('http_req_failed')}</div>
// //     <div class="label">Taxa de erro</div>
// //   </div>

// // </div>

// // <div class="grid" style="margin-top:20px;">

// //   <div class="card">
// //     <div class="value">${getP95('http_req_duration')} ms</div>
// //     <div class="label">p95 Latência</div>
// //   </div>

// //   <div class="card">
// //     <div class="value">${getCount('iterations')}</div>
// //     <div class="label">Iterações</div>
// //   </div>

// //   <div class="card">
// //     <div class="value">${getCount('checks')}</div>
// //     <div class="label">Checks</div>
// //   </div>

// // </div>

// // <h2 style="margin-top:30px;">📦 Dados completos</h2>
// // <pre>${JSON.stringify(summary, null, 2)}</pre>

// // </body>
// // </html>
// // `;

// // fs.writeFileSync('report.html', html);

// // console.log('✔ report.html gerado com sucesso');


// const fs = require('fs');

// const summary = JSON.parse(fs.readFileSync('summary.json', 'utf-8'));
// const metrics = summary.metrics || {};

// // =======================
// // HELPERS
// // =======================

// function getCount(name) {
//   return metrics[name]?.count ?? 0;
// }

// function getAvg(name) {
//   return metrics[name]?.avg ? metrics[name].avg.toFixed(2) : 0;
// }

// function getP95(name) {
//   return metrics[name]?.['p(95)']
//     ? metrics[name]['p(95)'].toFixed(2)
//     : 0;
// }

// function getRate(name) {
//   return metrics[name]?.value
//     ? (metrics[name].value * 100).toFixed(2) + '%'
//     : '0%';
// }

// // =======================
// // HTML MODERNO
// // =======================

// const html = `
// <!DOCTYPE html>
// <html lang="pt-br">
// <head>
// <meta charset="UTF-8">
// <title>k6 Dashboard Pro</title>

// <style>
//   body {
//     margin: 0;
//     font-family: Arial;
//     background: #0a0f1c;
//     color: #e5e7eb;
//   }

//   header {
//     padding: 20px;
//     background: #0f172a;
//     border-bottom: 1px solid #1f2937;
//     font-size: 20px;
//     font-weight: bold;
//     color: #38bdf8;
//   }

//   .grid {
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
//     gap: 18px;
//     padding: 20px;
//   }

//   .card {
//     background: linear-gradient(145deg, #111827, #0b1220);
//     border: 1px solid #1f2937;
//     border-radius: 14px;
//     padding: 22px;
//     box-shadow: 0 0 20px rgba(56,189,248,0.08);
//     transition: 0.2s;
//   }

//   .card:hover {
//     transform: translateY(-3px);
//     box-shadow: 0 0 25px rgba(34,197,94,0.2);
//   }

//   .value {
//     font-size: 30px;
//     font-weight: bold;
//     color: #22c55e;
//   }

//   .label {
//     font-size: 12px;
//     color: #94a3b8;
//     margin-top: 5px;
//   }

//   .section {
//     padding: 20px;
//   }

//   details {
//     background: #111827;
//     padding: 15px;
//     border-radius: 12px;
//     border: 1px solid #1f2937;
//   }

//   summary {
//     cursor: pointer;
//     color: #38bdf8;
//     font-weight: bold;
//   }

//   pre {
//     background: #0b1220;
//     padding: 15px;
//     border-radius: 10px;
//     overflow: auto;
//     font-size: 12px;
//     color: #cbd5e1;
//   }
// </style>
// </head>

// <body>

// <header>📊 k6 Performance Dashboard Pro</header>

// <div class="grid">

//   <div class="card">
//     <div class="value">${getCount('http_reqs')}</div>
//     <div class="label">Requisições</div>
//   </div>

//   <div class="card">
//     <div class="value">${getAvg('http_req_duration')} ms</div>
//     <div class="label">Latência média</div>
//   </div>

//   <div class="card">
//     <div class="value">${getP95('http_req_duration')} ms</div>
//     <div class="label">p95 Latência</div>
//   </div>

//   <div class="card">
//     <div class="value">${getRate('http_req_failed')}</div>
//     <div class="label">Taxa de erro</div>
//   </div>

//   <div class="card">
//     <div class="value">${getCount('iterations')}</div>
//     <div class="label">Iterações</div>
//   </div>

//   <div class="card">
//     <div class="value">${getCount('checks')}</div>
//     <div class="label">Checks</div>
//   </div>

// </div>

// <div class="section">

//   <details>
//     <summary>📦 Ver JSON completo (expandir)</summary>
//     <pre>${JSON.stringify(summary, null, 2)}</pre>
//   </details>

// </div>

// </body>
// </html>
// `;

// fs.writeFileSync('report.html', html);

// console.log('✔ Dashboard moderno gerado com sucesso');


const fs = require('fs');
const puppeteer = require('puppeteer');

// =======================
// LER JSON DO K6
// =======================

const summary = JSON.parse(
  fs.readFileSync('summary.json', 'utf-8')
);

const metrics = summary.metrics || {};

// =======================
// HELPERS
// =======================

function getCount(name) {
  return metrics[name]?.count ?? 0;
}

function getAvg(name) {
  return metrics[name]?.avg
    ? metrics[name].avg.toFixed(2)
    : 0;
}

function getP95(name) {
  return metrics[name]?.['p(95)']
    ? metrics[name]['p(95)'].toFixed(2)
    : 0;
}

function getRate(name) {
  return metrics[name]?.value
    ? (metrics[name].value * 100).toFixed(2)
    : '0';
}

function getRateFormatted(name) {
  return getRate(name) + '%';
}

// =======================
// HTML (ESTILO K6)
// =======================

const html = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>k6 Dashboard</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
  body {
    margin: 0;
    font-family: Inter, Arial;
    background: #0d1321;
    color: #e6edf3;
  }

  header {
    padding: 16px 24px;
    background: #111827;
    border-bottom: 1px solid #1f2937;
    font-weight: 600;
  }

  .top-cards {
    display: flex;
    gap: 12px;
    padding: 20px;
  }

  .card {
    flex: 1;
    background: #151c2f;
    border-radius: 10px;
    padding: 16px;
  }

  .label {
    font-size: 12px;
    color: #9ca3af;
  }

  .value {
    font-size: 22px;
    margin-top: 6px;
  }

  .green { color: #22c55e; }
  .blue { color: #38bdf8; }
  .pink { color: #f472b6; }
  .yellow { color: #facc15; }

  .chart-container {
    margin: 20px;
    background: #151c2f;
    border-radius: 10px;
    padding: 20px;
  }
</style>
</head>

<body>

<header>k6 - Performance Overview</header>

<div class="top-cards">

  <div class="card">
    <div class="label">Iterations</div>
    <div class="value green">${getCount('iterations')}</div>
  </div>

  <div class="card">
    <div class="label">HTTP Requests</div>
    <div class="value blue">${getCount('http_reqs')}</div>
  </div>

  <div class="card">
    <div class="label">Avg Duration</div>
    <div class="value yellow">${getAvg('http_req_duration')} ms</div>
  </div>

  <div class="card">
    <div class="label">P95 Duration</div>
    <div class="value yellow">${getP95('http_req_duration')} ms</div>
  </div>

  <div class="card">
    <div class="label">Failures</div>
    <div class="value pink">${getRateFormatted('http_req_failed')}</div>
  </div>

</div>

<div class="chart-container">
  <canvas id="chart"></canvas>
</div>

<script>
  const ctx = document.getElementById('chart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Start','Middle','End'],
      datasets: [
        {
          label: 'Requests',
          data: [10, 50, ${getCount('http_reqs')}],
          borderColor: '#22c55e',
          tension: 0.3
        },
        {
          label: 'Duration',
          data: [100, 200, ${getAvg('http_req_duration')}],
          borderColor: '#38bdf8',
          tension: 0.3
        },
        {
          label: 'Failures',
          data: [0, 2, ${getRate('http_req_failed')}],
          borderColor: '#f472b6',
          tension: 0.3
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: '#e5e7eb' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' }
        },
        y: {
          ticks: { color: '#9ca3af' }
        }
      }
    }
  });
</script>

</body>
</html>
`;

// =======================
// GERAR HTML
// =======================

fs.writeFileSync('report.html', html);

console.log('✔ HTML gerado');

// =======================
// GERAR PDF
// =======================

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`file://${__dirname}/report.html`, {
    waitUntil: 'networkidle0',
  });

  await page.pdf({
    path: 'k6-report.pdf',
    format: 'A4',
    printBackground: true,
  });

  await browser.close();

  console.log('✅ PDF gerado com sucesso!');
})();
/**
 * Reports Module Test Script
 *
 * Bypasses the SMTP-dependent login flow by directly minting a JWT
 * using the same secret and payload format as auth.service.js.
 *
 * Run: node test-reports.js
 */

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const BASE = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET;

// Mint a JWT for Alice (userId=1) matching the format in auth.service.js:verifyOtp
// The seed creates users with autoincrement IDs starting at 1.
// We'll first fetch Alice's actual data by querying the users endpoint after minting.

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

function printResult(label, status, expected, data) {
  const pass = status === expected ? '✅ PASS' : '❌ FAIL';
  console.log(`\n${pass} | ${label} | Status: ${status} (expected ${expected})`);
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  console.log('='.repeat(60));
  console.log('  REPORTS MODULE — INTEGRATION TESTS');
  console.log('='.repeat(60));

  // We need the actual user ID. The seed creates alice first, so she's likely id=1.
  // Let's try id=1 first. We'll verify with /users/me.
  let aliceId = 1;
  let token = jwt.sign(
    { id: aliceId, email: 'alice@example.com', name: 'Alice Johnson' },
    JWT_SECRET,
    { expiresIn: '1d' },
  );

  // Verify token works by calling /users/me
  console.log('\n--- Verifying JWT token via /users/me ---');
  const meRes = await request('GET', '/users/me', null, token);

  if (meRes.status !== 200) {
    // Maybe the IDs don't start at 1 after a re-seed. Let's try a different approach.
    console.log('ID=1 did not work, trying to find Alice...');
    for (let tryId = 2; tryId <= 10; tryId++) {
      token = jwt.sign(
        { id: tryId, email: 'alice@example.com', name: 'Alice Johnson' },
        JWT_SECRET,
        { expiresIn: '1d' },
      );
      const tryRes = await request('GET', '/users/me', null, token);
      if (tryRes.status === 200 && tryRes.data.user?.email === 'alice@example.com') {
        aliceId = tryId;
        console.log(`Found Alice at id=${aliceId}`);
        break;
      }
    }
  } else {
    console.log(`✅ Token valid! Alice id=${aliceId}`);
    console.log('User:', JSON.stringify(meRes.data, null, 2));
  }

  let passed = 0;
  let failed = 0;

  // ============================================================
  // TEST 1: GET /api/reports/financial-summary
  // ============================================================
  const t1 = await request('GET', '/reports/financial-summary', null, token);
  printResult('Financial Summary', t1.status, 200, t1.data);
  const summary = t1.data?.data?.summary;
  if (t1.status === 200 && summary) {
    console.log(
      `  → Revenue: ${summary.totalRevenue}, Spent: ${summary.totalSpent}, Balance: ${summary.walletBalance}`,
    );
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // TEST 2: GET /api/reports/sales-chart (default 30 days)
  // ============================================================
  const t2 = await request('GET', '/reports/sales-chart', null, token);
  printResult('Sales Chart (30 days)', t2.status, 200, t2.data);
  const chart30 = t2.data?.data?.chartData;
  if (t2.status === 200 && Array.isArray(chart30)) {
    console.log(`  → ${chart30.length} day(s) of data`);
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // TEST 3: GET /api/reports/sales-chart?days=7
  // ============================================================
  const t3 = await request('GET', '/reports/sales-chart?days=7', null, token);
  printResult('Sales Chart (7 days)', t3.status, 200, t3.data);
  if (t3.status === 200 && Array.isArray(t3.data?.data?.chartData)) {
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // TEST 4: GET /api/reports/top-products
  // ============================================================
  const t4 = await request('GET', '/reports/top-products', null, token);
  printResult('Top Products', t4.status, 200, t4.data);
  const topProducts = t4.data?.data?.topProducts;
  if (t4.status === 200 && Array.isArray(topProducts)) {
    console.log(`  → ${topProducts.length} top product(s)`);
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // TEST 5: Unauthenticated request (expect 401)
  // ============================================================
  const t5 = await request('GET', '/reports/financial-summary');
  printResult('No Auth → 401', t5.status, 401, t5.data);
  if (t5.status === 401) {
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // TEST 6: Invalid days param (expect 400)
  // ============================================================
  const t6 = await request('GET', '/reports/sales-chart?days=0', null, token);
  printResult('Invalid days=0 → 400', t6.status, 400, t6.data);
  if (t6.status === 400) {
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // TEST 7: days=999 → should fail validation (max 365)
  // ============================================================
  const t7 = await request('GET', '/reports/sales-chart?days=999', null, token);
  printResult('Invalid days=999 → 400', t7.status, 400, t7.data);
  if (t7.status === 400) {
    passed++;
  } else {
    failed++;
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);

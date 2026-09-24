const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const authGuard = require('../server/middleware/authGuard');

describe('authGuard.hasPermission', () => {
  const run = (user, permission) => {
    const req = { user };
    let status = null;
    let payload = null;
    let nextCalled = false;
    const res = {
      status: (s) => { status = s; return res; },
      json: (p) => { payload = p; return res; },
    };
    authGuard.hasPermission(permission)(req, res, () => { nextCalled = true; });
    return { status, payload, nextCalled };
  };

  it('calls next() when the user has the permission', () => {
    const user = { role: { permissions: [{ permission: 'users.read' }] } };
    const result = run(user, 'users.read');
    assert.equal(result.nextCalled, true);
  });

  it('returns 403 when the permission is missing', () => {
    const user = { role: { permissions: [{ permission: 'users.read' }] } };
    const result = run(user, 'users.write');
    assert.equal(result.nextCalled, false);
    assert.equal(result.status, 403);
  });

  it('returns 401 when unauthenticated', () => {
    const result = run(undefined, 'users.read');
    assert.equal(result.nextCalled, false);
    assert.equal(result.status, 401);
  });
});

describe('login validation rules', () => {
  // Mirrors the express-validator chain in server/routes/auth.js so the
  // contract is pinned without needing a database.
  const { body, validationResult } = require('express-validator');

  const loginRules = [
    body('username').trim().isLength({ min: 4 }).withMessage('Username must be at least 4 characters').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').notEmpty().withMessage('Password is required'),
  ];

  const runRules = async (bodyData) => {
    const req = { body: bodyData, params: {}, query: {} };
    for (const rule of loginRules) {
      await rule(req, {}, () => {});
    }
    return validationResult(req);
  };

  it('accepts valid credentials', async () => {
    const result = await runRules({ username: 'admin', password: 'Password@01' });
    assert.equal(result.isEmpty(), true);
  });

  it('rejects short username/password', async () => {
    const result = await runRules({ username: 'ab', password: '123' });
    assert.equal(result.isEmpty(), false);
    assert.equal(result.array().length, 2);
  });

  it('rejects missing fields', async () => {
    const result = await runRules({});
    assert.equal(result.isEmpty(), false);
  });
});

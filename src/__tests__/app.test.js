const request = require('supertest');
const app = require('../app');
const { describe } = require('@jest/globals');
const { test } = require('@jest/globals');
const { expect } = require('@jest/globals');

describe('Get /', () => {
  test('should get index.html', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});

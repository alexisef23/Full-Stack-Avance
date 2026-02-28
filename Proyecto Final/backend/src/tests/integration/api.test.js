const request = require('supertest');
const app = require('../../app');

describe('API Health Check', () => {
  it('should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('Authentication Routes', () => {
  const hasDatabase = !!process.env.DATABASE_URL;

  (hasDatabase ? it : it.skip)('should register a new user (requires DATABASE_URL)', async () => {
    const res = await request(app).post('/api/usuarios/register').send({
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
    });

    expect([201, 409]).toContain(res.statusCode);
  });

  it('should not access protected route without token', async () => {
    const res = await request(app).get('/api/usuarios/profile');
    expect(res.statusCode).toBe(401);
  });
});

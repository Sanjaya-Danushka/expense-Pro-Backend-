const request = require('supertest');
const app = require('../app');

describe('API Health Check', () => {
  it('should return 200 and a success message', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('Server is running');
  });
});

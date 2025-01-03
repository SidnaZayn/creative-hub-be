import request from 'supertest';
import jwt from 'jsonwebtoken';
import { supabase } from '../src/lib/supabase';

describe('Protected Routes', () => {
  test('should allow access with a valid token', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email : 'zidnazen@gmail.com',
      password : '11223344',
    });
    const { access_token, refresh_token } = data.session;

    const res = await request(global.app)
      .get('/protected-route')
      .set('Authorization', 'Bearer ' + access_token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Success' });
  });

  test('should deny access with a missing token', async () => {
    const res = await request(global.app).get('/protected-route');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Token missing');
  });

  test('should deny access with an expired token', async () => {
    const expiredToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '-1h' });
    const res = await request(global.app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid token or expired token');
  });
});

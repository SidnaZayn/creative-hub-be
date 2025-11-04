import request from 'supertest';
import { supabase } from '../src/lib/supabase';
import { after } from 'node:test';

let user;
let userToken;
let testData;
beforeAll(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'zidnazen@gmail.com',
    password: '11223344',
  });
  const { access_token, refresh_token } = data.session;

  // userToken = access_token;
  userToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6Ikt6NmsveWVtdE9BQy9hOXMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3pxcHhjamdzaWpqcW5tZ3dteWZqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJiMDkzOWQ4Zi1lOTAzLTRiNjYtYTAxZS00NmIzOGFlNzIxNzYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyMjYyNTEyLCJpYXQiOjE3NjIyNTg5MTIsImVtYWlsIjoiemlkbmF6ZW5AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjIyNTg5MTJ9XSwic2Vzc2lvbl9pZCI6IjU0YTVjMWQzLTM2ZTUtNGRlZi05MzllLWEyZjdlZTk1Mjg1MiIsImlzX2Fub255bW91cyI6ZmFsc2V9.KIVdPkVETkakg2LilsdxsBybgySDrYzxj5DnOYm8hE0";
  const { data: userData } = await supabase.auth.getUser();
  user = userData.user;

  testData = await request(global.app)
    .post('/api/booking')
    .set('Authorization', 'Bearer ' + userToken)
    .send({
      date: new Date(),
      spaceSessionId: 'f32150ef-db32-4c83-aa82-3a4217e156b8',
      userId: user.id,
      name: 'Test Booking',
    }).then(res => res.body.data);
    console.log(testData)
});


describe('GET /dashboard/user/bookings', () => {
  test('fetch all upcoming user bookings', async () => {
    const response = await request(global.app)
      .get('/api/dashboard/user/bookings')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('fetch data with PAID status', async () => {
    const response = await request(global.app)
      .get('/api/dashboard/user/bookings?status=PAID')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('fetch data with UNPAID status', async () => {
    const response = await request(global.app)
      .get('/api/dashboard/user/bookings?status=UNPAID')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('fetch data with CANCEL status', async () => {
    const response = await request(global.app)
      .get('/api/dashboard/user/bookings?status=CANCEL')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe('GET /dashboard/user/booking-history', () => {
  test('fetch all user booking history', async () => {
    const response = await request(global.app)
        .get('/api/dashboard/user/booking-history')
        .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe('PATCH /dashboard/user/booking/:id/cancel', () => {
    test('cancel a booking', async () => {
        const response = await request(global.app)
            .patch(`/api/dashboard/user/booking/${testData.id}/cancel`)
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('count', 1);
    });
});

describe('GET /dashboard/user/booking/:id', () => {
  test('fetch booking by id', async () => {
    const response = await request(global.app)
      .get(`/api/dashboard/user/booking/${testData.id}`)
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', testData.id);
  });
  test('fetch booking by invalid id', async () => {
    const response = await request(global.app)
      .get('/api/dashboard/user/booking/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

afterAll(async () => {
  await request(global.app)
    .delete('/api/booking/' + testData.id)
    .set('Authorization', 'Bearer ' + userToken);
});
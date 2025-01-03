import request from 'supertest';
import { supabase } from '../src/lib/supabase';

let user;
let userToken;
let testData;
beforeAll(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'zidnazen@gmail.com',
    password: '11223344',
  });
  const { access_token, refresh_token } = data.session;

  userToken = access_token;
  const { data: userData } = await supabase.auth.getUser();
  user = userData.user;
});

describe('POST /api/category', () => {
  test('create category with valid data', async () => {
    const response = await request(global.app)
      .post('/api/category')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        name: 'Category Test',
      });

    testData = response.body.data;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name');
  });

  test('create category with invalid data', async () => {
    const response = await request(global.app)
      .post('/api/category')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.message).toBe('Name is required');
  });
});

describe('GET /api/categories', () => {
  test('fetch all categories', async () => {
    const response = await request(global.app)
      .get('/api/categories')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('fetch data with search query', async () => {
    const response = await request(global.app)
      .get('/api/categories?name=Category')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe('GET /api/category/:id', () => {
  test('fetch category by id', async () => {
    const response = await request(global.app)
      .get('/api/category/' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name');
  });

  test('fetch category by invalid id', async () => {
    const response = await request(global.app)
      .get('/api/category/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('PUT /api/category/:id', () => {
  test('update category by id', async () => {
    const response = await request(global.app)
      .put('/api/category/' + testData.id)
      .send({
        name: 'Catefory Test Update'
      })
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
  });

  test('update category by invalid id', async () => {
    const response = await request(global.app)
      .put('/api/category/0')
      .send({
        name: 'Category Test Update'
      })
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('DELETE /api/category/:id', () => {
  test('delete category by id', async () => {
    const response = await request(global.app)
      .delete('/api/category/' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
  });

  test('delete category by invalid id', async () => {
    const response = await request(global.app)
      .delete('/api/category/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
  });
});

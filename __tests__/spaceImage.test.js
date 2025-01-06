import request from 'supertest';
import { supabase } from '../src/lib/supabase';

let user;
let userToken;
let testData;
const spaceId = '963d34d3-d4a6-4621-8338-3b9f24d0b14c';

beforeAll(async () => {
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: 'zidnazen@gmail.com',
  //   password: '11223344',
  // });
  // const { access_token, refresh_token } = data.session;

  userToken = global.app.access_token;
  const { data: userData } = await supabase.auth.getUser(userToken);
  user = userData.user;
});

describe('POST /api/space/image', () => {
  test('create space image with valid data', async () => {
    const response = await request(global.app)
      .post('/api/space/image')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        filename: 'image.jpg',
        spaceId: spaceId,
        size: 5000,
        url: 'google.com',
      });

    testData = response.body.data;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('filename');
    expect(response.body.data.spaceId).toBe(spaceId);
  });

  test('create space with invalid data', async () => {
    const response = await request(global.app)
      .post('/api/space/image')
      .set('Authorization', 'Bearer ' + userToken)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.message).toBe('filename, url and space id is required');
  });
});

describe('GET /api/space/image', () => {
  test('fetch all images by space id', async () => {
    const response = await request(global.app)
      .get('/api/space/image?spaceId='+ spaceId)
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('fetch all images without space id', async () => {
    const response = await request(global.app)
      .get('/api/space/image')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Error');
  });
});

describe('GET /api/space/image/:id', () => {
  test('fetch image by id', async () => {
    const response = await request(global.app)
      .get('/api/space/image/' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('filename');
    expect(response.body.data).toHaveProperty('url');
  });

  test('fetch space by invalid id', async () => {
    const response = await request(global.app)
      .get('/api/space/image/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('DELETE /api/space/image/:id', () => {
  test('delete image by id', async () => {
    const response = await request(global.app)
      .delete('/api/space/image/' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
  });

  test('delete image by invalid id', async () => {
    const response = await request(global.app)
      .delete('/api/space/image/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
  });
});

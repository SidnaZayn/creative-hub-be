import request from 'supertest';
import { supabase } from '../src/lib/supabase';

let user;
let userToken;
let testData;
beforeAll(async () => {
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: 'zidnazen@gmail.com',
  //   password: '11223344',
  // });
  // const { access_token, refresh_token } = data.session; console.log(access_token)

  userToken = global.app.access_token;
  const { data: userData } = await supabase.auth.getUser(userToken);
  user = userData.user;
});

describe('POST /api/space', () => {
  test('create space with valid data', async () => {
    const response = await request(global.app)
      .post('/api/space')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        name: 'Space Test',
        ownerId: user.id,
        description: 'desc',
        location: 'Jakarta',
        features: { audio: true, wifi: true, projector: true, ac: true },
        capacity: 10,
        pricePerHour: 50000,
        categoryId: '0af8eab5-4108-4ba1-b004-7333622e6f10',
        images: [
          {
            filename: 'image_1.jpg',
            size: 500,
            path: 'F:/Sidna/code learning/creative-hub/creative-hub-be/__tests__/img/image_1.jpg',
            url: 'google.com',
          },
          {
            filename: 'image_2.jpg',
            size: 500,
            path: 'F:/Sidna/code learning/creative-hub/creative-hub-be/__tests__/img/image_2.jpg',
            url: 'google.com',
          },
          {
            filename: 'image_3.jpg',
            size: 500,
            path: 'F:/Sidna/code learning/creative-hub/creative-hub-be/__tests__/img/image_3.jpg',
            url: 'google.com',
          },
        ],
      }); 

    testData = response.body.data.space;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('space');
    expect(response.body.data.images).toBeInstanceOf(Array);
    expect(response.body.data.space).toHaveProperty('id');
    expect(response.body.data.space).toHaveProperty('name');
    expect(response.body.data.space).toHaveProperty('ownerId');
    expect(response.body.data.space.categoryId).toBe('0af8eab5-4108-4ba1-b004-7333622e6f10');
  }, 10000);

  test('create space with invalid data', async () => {
    const response = await request(global.app)
      .post('/api/space')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        description: 'desc',
        location: 'Jakarta',
        features: { audio: true, wifi: true, projector: true, ac: true },
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.message).toBe('Name, capacity and pricePerHour are required');
  });
});

describe('GET /api/space', () => {
  test('fetch all spaces', async () => {
    const response = await request(global.app)
      .get('/api/space')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('fetch data with search query', async () => {
    const response = await request(global.app)
      .get('/api/space?name=Space')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe('GET /api/space/:id', () => {
  test('fetch space by id', async () => {
    const response = await request(global.app)
      .get('/api/space/' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('ownerId');
  });

  test('fetch space by invalid id', async () => {
    const response = await request(global.app)
      .get('/api/space/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('PUT /api/space/:id', () => {
  test('update space by id', async () => {
    const response = await request(global.app)
      .put('/api/space/' + testData.id)
      .send({
        name: 'Space Test Update',
        ownerId: user.id,
        description: 'desc',
        location: 'Jakarta',
        features: { audio: true, wifi: true, projector: true, ac: true },
        capacity: 11,
        pricePerHour: 51000,
      })
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
  });

  test('update space by invalid id', async () => {
    const response = await request(global.app)
      .put('/api/space/0')
      .send({
        name: 'Space Test Update',
        ownerId: user.id,
        description: 'desc',
        location: 'Jakarta',
        features: { audio: true, wifi: true, projector: true, ac: true },
        capacity: 11,
        pricePerHour: 51000,
      })
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('DELETE /api/space/:id', () => {
  test('delete space by id and delete images', async () => {
    const response = await request(global.app)
      .delete('/api/space/' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);
    const images = await request(global.app)
      .get('/api/space/image?spaceId=' + testData.id)
      .set('Authorization', 'Bearer ' + userToken);
    expect(images.body.data.length).toBe(0);
    expect(response.body.message).toBe('success delete data');
    expect(response.status).toBe(200);
  });

  test('delete space by invalid id', async () => {
    const response = await request(global.app)
      .delete('/api/space/0')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(500);
  });
});

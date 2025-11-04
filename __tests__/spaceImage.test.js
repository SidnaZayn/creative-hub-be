import request from 'supertest';
import { supabase } from '../src/lib/supabase';

let user, userToken, testData, spaceId;

beforeAll(async () => {
    userToken = global.app.access_token;
    const { data: userData } = await supabase.auth.getUser(userToken);
    user = userData.user;
    const sessions = [
        {
          day: "TUESDAY",
          startTime: "14:00",
          endTime: "16:00",
          price: "50000",
          capacity: "10",
        },
        {
          day: "WEDNESDAY",
          startTime: "14:00",
          endTime: "16:00",
          price: "50000",
          capacity: "10",
        },
      ];
      const features = { audio: true, wifi: true, projector: true, ac: true };
      const policies = ["policy 1", "policy 2", "policy 3"];
    
      const responseSpace = await request(global.app)
        .post("/api/space")
        .set("Authorization", "Bearer " + userToken)
        .field("name", "Space Test")
        .field("ownerId", user.id)
        .field("description", "desc")
        .field("location", "Jakarta")
        .field("features", JSON.stringify(features))
        .field("capacity", 10)
        .field("pricePerHour", 50000)
        .field("categoryId", "1f570eef-4837-495a-bb55-806f614e440f")
        .field("policies", policies)
        .field("sessions", JSON.stringify(sessions))
        .attach("images", "__tests__/img/image_1.jpg");
      spaceId = responseSpace.body.data.space.id;
}, 30000);

describe('POST /api/space/image', () => {
    test('create space image with valid data', async () => {
        const response = await request(global.app)
            .post('/api/space/image')
            .set('Authorization', 'Bearer ' + userToken)
            .send({
                filename: 'image_1.jpg',
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

describe('GET /api/space/:spaceId/images', () => {
    test('fetch all images by space id', async () => {
        const response = await request(global.app)
            .get('/api/space/' + spaceId + '/images')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    test('fetch all images without space id', async () => {
        const response = await request(global.app)
            .get('/api/space/' + null + '/images')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('data not found');
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

afterAll(async () => {
    // Clean up: delete the created space
    await request(global.app)
        .delete('/api/space/' + spaceId)
        .set('Authorization', 'Bearer ' + userToken);
});
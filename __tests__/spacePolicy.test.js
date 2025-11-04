import request from 'supertest';
import { supabase } from '../src/lib/supabase';

let user;
let userToken;
let testData;
const spaceId = '2ee8260b-d471-4868-a578-a819bedefd32';

beforeAll(async () => {
    userToken = global.app.access_token;
    const { data: userData } = await supabase.auth.getUser(userToken);
    user = userData.user;
});

describe('POST /api/space/policy', () => {
    test('create space policy with valid data', async () => {
        const response = await request(global.app)
            .post('/api/space/policy')
            .set('Authorization', 'Bearer ' + userToken)
            .send({
                policy: 'policy 1',
                spaceId: spaceId,
            });

        testData = response.body.data;
        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
    });

    test('create space policy with invalid data', async () => {
        const response = await request(global.app)
            .post('/api/space/policy')
            .set('Authorization', 'Bearer ' + userToken)
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/space/:spaceId/policies', () => {
    test('fetch all policy by space id', async () => {
        const response = await request(global.app)
            .get('/api/space/' + spaceId + '/policies')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    test('fetch all policy by invalid space id', async () => {
        const response = await request(global.app)
            .get('/api/space/invalid_space_id/policies')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(404);
    });
});

describe('GET /api/space/policy/:id', () => {
    test('fetch policy by id', async () => {
        const response = await request(global.app)
            .get('/api/space/policy/' + testData.id)
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');
    });

    test('fetch policy by invalid id', async () => {
        const response = await request(global.app)
            .get('/api/space/policy/invalid_id')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(500);
    });
});

describe('PUT /api/space/policy/:id', () => {
    test('update policy by id', async () => {
        const response = await request(global.app)
            .put('/api/space/policy/' + testData.id)
            .set('Authorization', 'Bearer ' + userToken)
            .send({
                newPolicy: 'policy 2',
                spaceId: spaceId,
            });
        expect(response.status).toBe(200);
        expect(response.body.data.policy).toBe('policy 2');
    });

    test('update policy by invalid id', async () => {
        const response = await request(global.app)
            .put('/api/space/policy/invalid_id')
            .set('Authorization', 'Bearer ' + userToken)
            .send({
                newPolicy: 'policy 2',
                spaceId: spaceId,
            });
        expect(response.status).toBe(400);
    });
});

describe('DELETE /api/space/policy/:id', () => {
    test('delete policy by id', async () => {
        const response = await request(global.app)
            .delete('/api/space/policy/' + testData.id)
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
    });

    test('delete policy by invalid id', async () => {
        const response = await request(global.app)
            .delete('/api/space/policy/invalid_id')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(500);
    });
});
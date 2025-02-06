import request from 'supertest';
import { supabase } from '../src/lib/supabase';

let user;
let userToken;
let testData;
const spaceId = '2ee8260b-d471-4868-a578-a819bedefd32';

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

describe('POST /api/space/sessions', () => {
    test('create space session with valid data', async () => {
        const response = await request(global.app)
            .post('/api/space/sessions')
            .set('Authorization', 'Bearer ' + userToken)
            .send({
                day: 'TUESDAY',
                startTime: '14:00',
                endTime: '16:00',
                price: '50000',
                capacity: '10',
                notes: 'no notes',
                spaceId: spaceId,
            });

        testData = response.body.data;
        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.spaceId).toBe(spaceId);
    });

    test('create space with invalid data', async () => {
        const response = await request(global.app)
            .post('/api/space/sessions')
            .set('Authorization', 'Bearer ' + userToken)
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/space/:spaceId/sessions', () => {
    test('fetch all sessions by space id', async () => {
        const response = await request(global.app)
            .get('/api/space/' + spaceId + '/sessions')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    test('fetch all sessions with invalid space id', async () => {
        const response = await request(global.app)
            .get('/api/space/120948/sessions')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('data not found');
    });
});

describe('GET /api/space/sessions/:id', () => {
    test('fetch space session by id', async () => {
        const response = await request(global.app)
            .get('/api/space/sessions/' + testData.id)
            .set('Authorization', 'Bearer ' + userToken);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');
    });

    test('fetch space by invalid id', async () => {
        const response = await request(global.app)
            .get('/api/space/sessions/0')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('DELETE /api/space/sessions/:id', () => {
    test('delete session by id', async () => {
        const response = await request(global.app)
            .delete('/api/space/sessions/' + testData.id)
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(200);
    });

    test('delete session by invalid id', async () => {
        const response = await request(global.app)
            .delete('/api/space/sessions/0')
            .set('Authorization', 'Bearer ' + userToken);
        expect(response.status).toBe(500);
    });
});

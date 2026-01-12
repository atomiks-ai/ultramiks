/**
 * Unit tests for Ultramiks HTTP API
 * TDD RED Phase: These tests will fail until we implement the server
 */

const request = require('supertest');

// Will implement server in GREEN phase
let app;

describe('Ultramiks API - Health Endpoint', () => {
    beforeAll(() => {
        // Mock the server without real browser
        process.env.NODE_ENV = 'test';
        app = require('../../src/server');
    });

    afterAll(() => {
        // Cleanup if server has close method
        if (app && app.close) {
            app.close();
        }
    });

    test('GET /health returns 200 OK with status', async () => {
        const response = await request(app)
            .get('/health')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('ok');
        expect(response.body).toHaveProperty('service', 'ultramiks');
        expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /health includes browser status in test mode', async () => {
        const response = await request(app)
            .get('/health')
            .expect(200);

        // In test mode, browser should be mocked
        expect(response.body).toHaveProperty('browser');
        expect(response.body.browser).toBe('mocked');
    });
});

describe('Ultramiks API - Deep Research Endpoint', () => {
    test('POST /deep-research requires query parameter', async () => {
        const response = await request(app)
            .post('/deep-research')
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/query.*required/i);
    });

    test('POST /deep-research accepts valid request', async () => {
        const response = await request(app)
            .post('/deep-research')
            .send({
                query: 'Test research topic',
                depth: 'quick'
            })
            .expect(200);

        expect(response.body).toHaveProperty('report');
        expect(response.body).toHaveProperty('quota_remaining');
        expect(typeof response.body.quota_remaining).toBe('number');
    });

    test('POST /deep-research defaults to comprehensive depth', async () => {
        const response = await request(app)
            .post('/deep-research')
            .send({ query: 'Test topic' })
            .expect(200);

        // Should accept request without depth parameter
        expect(response.body).toHaveProperty('report');
    });

    test('POST /deep-research enforces quota limits', async () => {
        // Mock quota exhausted scenario
        const response = await request(app)
            .post('/deep-research')
            .set('X-Test-Quota-Exhausted', 'true')
            .send({ query: 'Test' })
            .expect(429);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/quota.*exceeded/i);
    });
});

describe('Ultramiks API - Error Handling', () => {
    test('GET /invalid-endpoint returns 404', async () => {
        await request(app)
            .get('/invalid-endpoint')
            .expect(404);
    });

    test('Malformed JSON returns 400', async () => {
        const response = await request(app)
            .post('/deep-research')
            .set('Content-Type', 'application/json')
            .send('invalid json{')
            .expect(400);
    });

    test('Production mode calls browser automation', async () => {
        // Temporarily set production mode
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        // Browser automation will fail (no browser running in test)
        const response = await request(app)
            .post('/deep-research')
            .send({ query: 'Test' })
            .expect(500);

        expect(response.body.error).toMatch(/automation failed/i);

        // Restore test mode
        process.env.NODE_ENV = originalEnv;
    });
});

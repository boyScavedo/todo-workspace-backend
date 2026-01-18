import request from 'supertest'

import app from "../../app.js"

describe('User Routes', () => {
    describe('GET /tw/v1/users/', () => {

        test('should return status 200', async () => {
            const response = await request(app).get('/tw/v1/users').expect('Content-Type',/json/).expect(200)
            expect(response.status).toBe(200)
        })
    })
})
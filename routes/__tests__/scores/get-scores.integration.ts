import supertest from 'supertest'

import server from '../../../app'


describe('GET /scores', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    it('responds with score data', async () => {
        const { body, headers, status } = await supertest(server.server).get('/scores')

        expect(headers['content-type']).toMatch(/json/)
        expect(status).toEqual(200)
        expect(body.length).toBeGreaterThan(0)
        expect(body[0].score).toBeDefined()
    })
})

import supertest from 'supertest'
import server from '../../app'


describe('GET /games', () => {
    beforeEach(async () => {
        await server.ready()
    })

    afterEach(async () => {
        await server.close()
    })

    it('responds with json', async () => {

        const response = await supertest(server.server)
            .get('/games')

        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.status).toEqual(200)
    })
})

import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../../common/games.types'
import { gameFactory } from '../test-utilities/factories/game-factory'
import { mockHandleError, mockHandleNotFoundError } from '../__mocks__/customErrorMocks'
import server from '../../../app'


describe('GET /games/id', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    describe('success cases', () => {
        let createGame: Disposable<unknown>[]
        let game: GameData

        game = {
            id: uuidv4(),
            description: '5 on 5 madness!',
            imageUrl: null,
            isDeleted: false,
            slug: 'killer-queen',
            title: 'Killer Queen',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        beforeEach(async () => {
            createGame = await Promise.all([gameFactory(server.slonik.pool, game)])
        })

        afterEach(async () => {
            await disposeAll(createGame)
        })

        it('responds with the correct game', async () => {
            const { body, status } = await supertest(server.server).get(`/games/${game.id}`)

            expect(status).toEqual(200)
            expect(body.id).toEqual(game.id)
            expect(body.description).toEqual(game.description)
            expect(body.imageUrl).toBeNull()
            expect(body.isDeleted).toBe(false)
            expect(body.slug).toEqual(game.slug)
            expect(body.title).toEqual(game.title)
            expect(body.createdAt).toBeDefined()
            expect(body.updatedAt).toBeNull()
        })
    })

    describe('failure cases', () => {
        it('throws an API error if uuid is invalid', async () => {
            const invalidUuid = 'not-a-uuid'

            const { status } = await supertest(server.server).get(`/games/${invalidUuid}`)

            expect(mockHandleError).toHaveBeenCalled()
            expect(status).toEqual(500)
        })

        it('throws a not found error if game not found', async () => {
            const nonExistingGameId = uuidv4()

            const { body, status } = await supertest(server.server).get(`/games/${nonExistingGameId}`)

            expect(mockHandleNotFoundError).toHaveBeenCalled()
            expect(status).toEqual(404)
            expect(body.message).toEqual('OnSend /GET game: Game not found.')
        })
    })
})

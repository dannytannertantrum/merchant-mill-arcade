import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../../common/games.types'
import { gameFactory } from '../test-utilities/factories/game-factory'
import { mockHandleApiError, mockHandleNotFoundError } from '../__mocks__/customErrorMocks'
import { ScoreData } from '../../../common/scores.types'
import { scoreFactory } from '../test-utilities/factories/score-factory'
import server from '../../../app'


describe('/GET /scores/id', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    describe('success cases', () => {
        let createGame: Disposable<unknown>[]
        let createScore: Disposable<unknown>[]

        let game: GameData = {
            id: uuidv4(),
            description: 'Foreign key for getting a score',
            imageUrl: null,
            isDeleted: false,
            slug: 'foreign-key-get-score',
            title: 'Foreign Key Get Score',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }
        let score: ScoreData = {
            id: uuidv4(),
            gameId: game.id,
            isDeleted: false,
            initials: 'GLC',
            score: 190922,
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        beforeEach(async () => {
            // We need to create the game first because of the forieign key constraint
            createGame = await Promise.all([gameFactory(server.slonik.pool, game)])
            createScore = await Promise.all([scoreFactory(server.slonik.pool, score)])
        })

        afterEach(async () => {
            // Remember to delete the score first because of the forieign key constraint
            await disposeAll(createScore)
            await disposeAll(createGame)
        })

        it('responds with the correct score', async () => {
            const { body, status } = await supertest(server.server).get(`/scores/${score.id}`)

            expect(status).toEqual(200)
            expect(body.id).toEqual(score.id)
            expect(body.gameId).toEqual(score.gameId)
            expect(body.isDeleted).toEqual(score.isDeleted)
            expect(body.initials).toEqual(score.initials)
            expect(body.score).toEqual(score.score)
            expect(body.createdAt).toEqual(score.createdAt)
            expect(body.updatedAt).toEqual(score.updatedAt)
        })
    })

    describe('failure cases', () => {
        it('throws an API error if uuid is invalid', async () => {
            const invalidUuid = 'not-a-valid-uuid'

            const { body, status } = await supertest(server.server).get(`/scores/${invalidUuid}`)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.message).toMatch(/API ERROR GETTING SCORE/)
        })

        it('throw a not found error if score not found', async () => {
            const nonExistingScoreId = uuidv4()

            const { body, status } = await supertest(server.server).get(`/scores/${nonExistingScoreId}`)

            expect(mockHandleNotFoundError).toHaveBeenCalled()
            expect(status).toEqual(404)
            expect(body.message).toEqual('NOT FOUND ERROR OnSend /GET score: Score not found.')
        })
    })
})

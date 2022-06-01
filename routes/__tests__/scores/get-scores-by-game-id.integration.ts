import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../../common/games.types'
import { gameFactory } from '../test-utilities/factories/game-factory'
import { mockHandleApiError } from '../__mocks__/customErrorMocks'
import { overrideValues } from '../../../utilities/overrides'
import { ScoreData } from '../../../common/scores.types'
import { scoreFactory } from '../test-utilities/factories/score-factory'
import server from '../../../app'


describe('/GET /scores-by-game-id/id', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    describe('success cases', () => {
        let createGames: Disposable<unknown>[]
        let createScores: Disposable<unknown>[]

        let gameWithScores: GameData = {
            id: uuidv4(),
            description: null,
            imageUrl: null,
            isDeleted: false,
            slug: 'foreign-key-game-with-scores',
            title: 'Foreign Key Game With Scores',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }
        let gameWithoutScores: GameData = {
            id: uuidv4(),
            description: null,
            imageUrl: null,
            isDeleted: false,
            slug: 'foreign-key-game-without-scores',
            title: 'Foreign Key Game Without Scores',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        let score1Lowest: ScoreData = {
            id: uuidv4(),
            gameId: gameWithScores.id,
            isDeleted: false,
            initials: 'GLC',
            score: 10000000,
            createdAt: new Date().toISOString(),
            updatedAt: null
        }
        let score2 = overrideValues<ScoreData>(score1Lowest, { id: uuidv4(), score: 20000000 })
        let score3 = overrideValues<ScoreData>(score1Lowest, { id: uuidv4(), score: 30000000 })
        let score4 = overrideValues<ScoreData>(score1Lowest, { id: uuidv4(), score: 40000000 })
        let score5 = overrideValues<ScoreData>(score1Lowest, { id: uuidv4(), score: 50000000 })
        let score6 = overrideValues<ScoreData>(score1Lowest, { id: uuidv4(), score: 60000000 })
        let score7Highest = overrideValues<ScoreData>(score1Lowest, { id: uuidv4(), score: 70000000 })

        beforeEach(async () => {
            // Create games first because of the forieign key constraint
            createGames = await Promise.all([
                gameFactory(server.slonik.pool, gameWithScores),
                gameFactory(server.slonik.pool, gameWithoutScores)
            ])

            createScores = await Promise.all([
                scoreFactory(server.slonik.pool, score1Lowest),
                scoreFactory(server.slonik.pool, score2),
                scoreFactory(server.slonik.pool, score3),
                scoreFactory(server.slonik.pool, score4),
                scoreFactory(server.slonik.pool, score5),
                scoreFactory(server.slonik.pool, score6),
                scoreFactory(server.slonik.pool, score7Highest)
            ])
        })

        afterEach(async () => {
            // Delete scores first because of the forieign key constraint
            await disposeAll(createScores)
            await disposeAll(createGames)
        })

        it('should return scores based on associated game id', async () => {
            const { body, status } = await supertest(server.server).get(`/scores-by-game/${gameWithScores.id}`)

            expect(status).toEqual(200)
            expect(body[0]).toBeDefined()
        })

        it('should return scores in DESC order with a limit of 5', async () => {
            const { body } = await supertest(server.server).get(`/scores-by-game/${gameWithScores.id}`)

            // We created 7 scores, so this should not be defined with the limit
            expect(body[5]).not.toBeDefined()
            expect(body[0].score).toEqual(score7Highest.score)
            expect(body[4].score).toEqual(score3.score)
        })

        it('should return an empty array if no scores found', async () => {
            const { body, status } = await supertest(server.server).get(`/scores-by-game/${gameWithoutScores.id}`)

            expect(status).toBe(200)
            expect(body).toEqual([])
        })
    })

    describe('failure cases', () => {
        it('should throw an API error if uuid is invalid', async () => {
            const invalidUuid = 'not-a-uuid'

            const { body, status } = await supertest(server.server).get(`/scores-by-game/${invalidUuid}`)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.message).toMatch(/API ERROR GETTING SCORES FOR GAME ID/)
        })
    })
})

import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../../common/games.types'
import { getScoreById } from '../../common-queries'
import { mockHandleNotFoundError } from '../__mocks__/customErrorMocks'
import { ScoreData } from '../../../common/scores.types'
import { scoreFactory } from '../test-utilities/factories/score-factory'
import server from '../../../app'
import { gameFactory } from '../test-utilities/factories/game-factory'


describe('DELETE /scores/id', () => {
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
            description: 'Foreign key for delete score',
            imageUrl: null,
            isDeleted: false,
            slug: 'foreign-key-delete-score',
            title: 'Foreign Key Delete Score',
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
            // Remember to delete the score first because of the foreign key constraint
            await disposeAll(createScore)
            await disposeAll(createGame)
        })

        it('soft deletes a score in the database', async () => {
            const deletedScore = await supertest(server.server).delete(`/scores/${score.id}`)
            const updatedScore = await getScoreById(server.slonik.pool, score.id)

            expect(deletedScore.status).toEqual(200)
            expect(deletedScore.body.isDeleted).toBe(true)
            expect(updatedScore?.isDeleted).toBe(true)
            expect(updatedScore?.updatedAt).not.toBeNull()
        })
    })

    describe('failure cases', () => {
        it('throws a not found error when the score does not exist', async () => {
            const noScoreInDatabaseId = uuidv4()

            const { body, status } = await supertest(server.server).delete(`/scores/${noScoreInDatabaseId}`)

            expect(mockHandleNotFoundError).toHaveBeenCalled()
            expect(status).toBe(404)
            expect(body.message).toMatch(/ERROR OnSend \/DELETE score/)
        })
    })
})

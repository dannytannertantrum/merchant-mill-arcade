import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../types/games.types'
import { gameFactory } from '../test-utilities/factories/game-factory'
import { mockHandleApiError, mockHandleNotFoundError, mockHandleValidationError } from '../__mocks__/customErrorMocks'
import { overrideValues } from '../../../utilities/overrides'
import { scoreFactory } from '../test-utilities/factories/score-factory'
import { ScoreData, ScoreRequestBodyWithGame } from '../../types/scores.types'
import server from '../../../app'


describe('PUT /scores/id', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    const game: GameData = {
        id: uuidv4(),
        description: 'We need this game for the foreign key',
        imageUrl: null,
        isDeleted: false,
        slug: 'game-for-update-score',
        title: 'Game for update score',
        createdAt: new Date().toISOString(),
        updatedAt: null
    }
    const score: ScoreData = {
        id: uuidv4(),
        game: game.id,
        initials: 'GLC',
        score: 9327583,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date('2001-01-10').toISOString()
    }

    let createGame: Disposable<unknown>[]
    let createScore: Disposable<unknown>[]

    // Don't forget to add the game first and delete the score first
    beforeEach(async () => {
        createGame = await Promise.all([gameFactory(server.slonik.pool, game)])
        createScore = await Promise.all([scoreFactory(server.slonik.pool, score)])
    })

    afterEach(async () => {
        await disposeAll(createScore)
        await disposeAll(createGame)
    })

    describe('success cases', () => {
        it('should update initials and score', async () => {
            const updatedScore = overrideValues<ScoreRequestBodyWithGame>(score, { initials: 'NEW', score: 777 })

            const { body, status } = await supertest(server.server).put(`/scores/${score.id}`).send(updatedScore)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(score.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(score.id)
            expect(body.initials).toEqual(updatedScore.initials)
            expect(body.initials).not.toEqual(score.initials)
            expect(body.score).toEqual(updatedScore.score)
            expect(body.score).not.toEqual(score.score)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
        })

        it('should update updatedAt if only score is changed', async () => {
            const onlyUpdateScore = overrideValues<ScoreRequestBodyWithGame>(score, { score: 777 })

            const { body, status } = await supertest(server.server).put(`/scores/${score.id}`).send(onlyUpdateScore)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(score.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(score.id)
            expect(body.score).toEqual(onlyUpdateScore.score)
            expect(body.score).not.toEqual(score.score)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
        })

        it('should update updatedAt if only initials are changed', async () => {
            const onlyUpdateInitials = overrideValues<ScoreRequestBodyWithGame>(score, { initials: 'NEW' })

            const { body, status } = await supertest(server.server).put(`/scores/${score.id}`).send(onlyUpdateInitials)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(score.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(score.id)
            expect(body.initials).toEqual(onlyUpdateInitials.initials)
            expect(body.initials).not.toEqual(score.initials)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
        })

        // This test is necessary in case a user submits the exact same data
        // e.g. someone goes to edit, realizes they don't want to make changes, and save it
        it('should not alter updatedAt if the intials and score remain the same', async () => {
            const { body, status } = await supertest(server.server).put(`/scores/${score.id}`).send(score)

            expect(status).toEqual(200)
            expect(body.initials).toEqual(score.initials)
            expect(body.score).toEqual(score.score)
            expect(body.updatedAt).toEqual(score.updatedAt)
        })
    })

    describe('failure cases', () => {
        it('throws a validation error when score is undefined', async () => {
            const scoreUndefined = overrideValues<ScoreRequestBodyWithGame>(score, { score: undefined })

            const { body, status } = await supertest(server.server).put(`/scores/$${score.id}`).send(scoreUndefined)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR UPDATING SCORE/)
        })

        it('throws a validation error when score is not a number', async () => {
            // @ts-ignore - ignoring the error telling us score cannot be a string
            // So we can properly test
            const scoreNotANumber = overrideValues<ScoreRequestBodyWithGame>(score, { score: '22notANumber22' })

            const { body, status } = await supertest(server.server).put(`/scores/$${score.id}`).send(scoreNotANumber)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR UPDATING SCORE/)
        })

        it('throws a validation error when score is less than zero', async () => {
            const scoreLessThanZero = overrideValues<ScoreRequestBodyWithGame>(score, { score: -344 })

            const { body, status } = await supertest(server.server).put(`/scores/$${score.id}`).send(scoreLessThanZero)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR UPDATING SCORE/)
        })

        it('throws a validation error when initials are undefined', async () => {
            const initialsUndefined = overrideValues<ScoreRequestBodyWithGame>(score, { initials: undefined })

            const { body, status } = await supertest(server.server).put(`/scores/$${score.id}`).send(initialsUndefined)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR UPDATING SCORE/)
        })

        it('throws a validation error when initials are an empty string', async () => {
            const initialsEmptyString = overrideValues<ScoreRequestBodyWithGame>(score, { initials: '' })

            const { body, status } = await supertest(server.server).put(`/scores/$${score.id}`).send(initialsEmptyString)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR UPDATING SCORE/)
        })

        it('throws an API error when initials are longer than 3 characters', async () => {
            const initialsTooLong = overrideValues<ScoreRequestBodyWithGame>(score, { initials: 'ROFL' })

            const { body, status } = await supertest(server.server).put(`/scores/$${score.id}`).send(initialsTooLong)

            // We might expect a validation error here, but we can let the database handle it
            // There's a constraint on more than 3 letters - good to test DB is handling errors as well!
            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            expect(body.message).toMatch(/ERROR GETTING SCORE IN UPDATE SCORE/)
        })

        it('throws a not found error when score cannot be found in database', async () => {
            const scoreDoesNotExist = overrideValues<ScoreRequestBodyWithGame>(score, { id: uuidv4() })

            const { body, status } = await supertest(server.server).put(`/scores/${scoreDoesNotExist.id}`).send(scoreDoesNotExist)

            expect(mockHandleNotFoundError).toHaveBeenCalled()
            expect(status).toEqual(404)
            expect(body.error).toEqual('Not Found')
            expect(body.message).toEqual('NOT FOUND ERROR OnSend /PUT score: Score not found.')
        })
    })
})

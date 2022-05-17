import { sql } from 'slonik'
import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../../common/games.types'
import { gameFactory } from '../test-utilities/factories/game-factory'
import { mockHandleApiError, mockHandleValidationError } from '../__mocks__/customErrorMocks'
import { overrideValues } from '../../../utilities/overrides'
import { ScoreRequestBodyWithGame } from '../../../common/scores.types'
import server from '../../../app'


describe('POST /scores', () => {
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
        slug: 'game-for-add-score',
        title: 'Game for add score',
        createdAt: new Date().toISOString(),
        updatedAt: null
    }
    const score = {
        id: uuidv4(),
        game: game.id,
        initials: 'GLC',
        score: 9327583
    }

    let createGame: Disposable<unknown>[]

    beforeEach(async () => {
        createGame = await Promise.all([gameFactory(server.slonik.pool, game)])
    })

    afterEach(async () => {
        // It may look like this is a mistake to not use the disposable here,
        // But the point is to test the full integration on a POST method
        // So we're not using the factory to create the score
        await server.slonik.pool.query(sql`
            DELETE FROM scores
            WHERE id IN(
                ${score.id}
            )
        `)

        await disposeAll(createGame)
    })

    describe('success cases', () => {
        it('adds a score to the database with fields defined', async () => {
            const { body, status } = await supertest(server.server).post('/scores').send(score)

            expect(status).toEqual(201)
            expect(body.id).toEqual(score.id)
            expect(body.game).toEqual(score.game)
            expect(body.isDeleted).toEqual(false)
            expect(body.initials).toEqual(score.initials)
            expect(body.score).toEqual(score.score)
            expect(body.createdAt).toBeDefined()
            expect(body.updatedAt).not.toBeDefined()
        })

        it('adds a score with whitespace trimmed on either side of initials', async () => {
            const whiteSpaceInitials = overrideValues<ScoreRequestBodyWithGame>(score, { initials: ' GLC  ' })

            const { body, status } = await supertest(server.server).post('/scores').send(whiteSpaceInitials)

            expect(status).toEqual(201)
            expect(body.initials).toEqual('GLC')
        })

        it('adds a score with floating point numbers rounded to nearest tenth', async () => {
            const floatingPointScore = overrideValues<ScoreRequestBodyWithGame>(score, { score: 45237.77 })

            const { body, status } = await supertest(server.server).post('/scores').send(floatingPointScore)

            expect(status).toEqual(201)
            expect(body.score).toEqual(45238)
        })
    })

    describe('failure cases', () => {
        it('throws a validation error when score is undefined', async () => {
            const scoreUndefined = overrideValues<ScoreRequestBodyWithGame>(score, { score: undefined })

            const { body, status } = await supertest(server.server).post('/scores').send(scoreUndefined)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR ADDING SCORE/)
        })

        it('throws a validation error when score is not a number', async () => {
            // @ts-ignore - ignoring the error telling us score cannot be a string so we can properly test
            const scoreNotANumber = overrideValues<ScoreRequestBodyWithGame>(score, { score: '22notANumber22' })

            const { body, status } = await supertest(server.server).post('/scores').send(scoreNotANumber)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR ADDING SCORE/)
        })

        it('throws a validation error when score is less than zero', async () => {
            const scoreLessThanZero = overrideValues<ScoreRequestBodyWithGame>(score, { score: -344 })

            const { body, status } = await supertest(server.server).post('/scores').send(scoreLessThanZero)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR ADDING SCORE/)
        })

        it('throws a validation error when initials are undefined', async () => {
            const initialsUndefined = overrideValues<ScoreRequestBodyWithGame>(score, { initials: undefined })

            const { body, status } = await supertest(server.server).post('/scores').send(initialsUndefined)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR ADDING SCORE/)
        })

        it('throws a validation error when initials are an empty string', async () => {
            const initialsEmptyString = overrideValues<ScoreRequestBodyWithGame>(score, { initials: '' })

            const { body, status } = await supertest(server.server).post('/scores').send(initialsEmptyString)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR ADDING SCORE/)
        })

        it('throws an API error when initials are longer than 3 characters', async () => {
            const initialsTooLong = overrideValues<ScoreRequestBodyWithGame>(score, { initials: 'ROFL' })

            const { body, status } = await supertest(server.server).post('/scores').send(initialsTooLong)

            // We might expect a validation error here, but we can let the database handle it
            // There's a constraint on more than 3 letters - good to test DB is handling errors as well!
            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            expect(body.message).toMatch(/ERROR ADDING SCORE/)
        })

        /*
            These last few tests are testing against bad actors
            We don't expect our users to submit uuids for games and scores!
            This helps explain API errors over validation errors
        */

        it('throws an API error when no game is attached', async () => {
            const noGameAttached = overrideValues<ScoreRequestBodyWithGame>(score, { game: undefined })

            const { body, status } = await supertest(server.server).post('/scores').send(noGameAttached)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            expect(body.message).toMatch(/ERROR ADDING SCORE/)
        })

        it('throws an API error when sending an invalid uuid for game', async () => {
            const invalidGameUuid = overrideValues<ScoreRequestBodyWithGame>(score, { game: 'not-valid' })

            const { body, status } = await supertest(server.server).post('/scores').send(invalidGameUuid)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            expect(body.message).toMatch(/ERROR ADDING SCORE/)
        })

        it('throws an API error when sending an invaid uuid for score', async () => {
            const invalidScoreUuid = overrideValues<ScoreRequestBodyWithGame>(score, { id: 'not-valid' })

            const { body, status } = await supertest(server.server).post('/scores').send(invalidScoreUuid)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            expect(body.message).toMatch(/ERROR ADDING SCORE/)
        })
    })
})

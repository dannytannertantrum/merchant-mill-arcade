import { sql } from 'slonik'
import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../../../test-utilities/disposables'
import { GameData } from '../../../types/games.types'
import { gameFactory } from '../../../test-utilities/factories/game-factory'
import {
    mockHandleApiError,
    mockHandleDuplicateEntryError,
    mockHandleValidationError
} from '../__mocks__/customErrorMocks'
import { overrideValues } from '../../../test-utilities/overrides'
import server from '../../../app'


describe('POST /games', () => {

    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    describe('success cases', () => {
        const bareMinimumRequestGame = {
            id: uuidv4(),
            title: 'Only sending a title!'
        }

        let baseGame: GameData = {
            id: uuidv4(),
            description: 'Testing for add game integration',
            imageUrl: null,
            isDeleted: false,
            slug: 'add-game-title',
            title: 'Add game title',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        let gameWithoutDescription: GameData,
            gameWithAddedWhiteSpaces: GameData,
            gameIsDeletedButSameTitle: GameData

        gameWithoutDescription = overrideValues<GameData>(baseGame, { id: uuidv4(), description: null, title: 'Add game no description' })
        gameIsDeletedButSameTitle = overrideValues<GameData>(baseGame, { id: uuidv4(), isDeleted: true })
        gameWithAddedWhiteSpaces = overrideValues<GameData>(baseGame, {
            id: uuidv4(),
            title: ' Space should    be cleaned up!  ',
            description: 'THIS   TOO!',
            imageUrl: '  https://www.pinballzarcade.com/wp-content/uploads/2018/01/744284a9f4fd8016f690df6b487b0b5a.jpg   '
        })

        afterEach(async () => {
            await server.slonik.pool.query(sql`
                DELETE FROM games
                WHERE id IN(
                    ${bareMinimumRequestGame.id},
                    ${baseGame.id},
                    ${gameWithoutDescription.id},
                    ${gameWithAddedWhiteSpaces.id},
                    ${gameIsDeletedButSameTitle.id}
                );
            `)
        })

        it('should add a game to the database with fields properly defined', async () => {
            const { body, status } = await supertest(server.server).post('/games').send(baseGame)

            expect(status).toEqual(201)
            expect(body.id).toEqual(baseGame.id)
            expect(body.description).toEqual(baseGame.description)
            expect(body.imageUrl).toEqual(baseGame.imageUrl)
            expect(body.isDeleted).toBe(false)
            expect(body.slug).toBeDefined()
            expect(body.title).toEqual(baseGame.title)
            expect(body.createdAt).toBeDefined()
            expect(body.updatedAt).not.toBeDefined()
        })

        it('should add a game to the database when sending minimum request body: title', async () => {
            const { body, status } = await supertest(server.server).post('/games').send(bareMinimumRequestGame)

            expect(status).toEqual(201)
            expect(body.id).toBeDefined()
            expect(body.title).toEqual('Only sending a title!')
        })

        it('should construct the slug', async () => {
            const { body } = await supertest(server.server).post('/games').send(bareMinimumRequestGame)

            // Notice it stripped out the exclamation point
            expect(body.slug).toMatch('only-sending-a-title')
            expect(body.title).toMatch(bareMinimumRequestGame.title)
        })

        it('should add a game when description is empty', async () => {
            const { body } = await supertest(server.server).post('/games').send(gameWithoutDescription)

            expect(body.title).toEqual(gameWithoutDescription.title)
            expect(body.description).toBe(null)
        })

        it('should clean up whitespace for description, imageUrl and title, and preserve capitalization', async () => {
            const { body } = await supertest(server.server).post('/games').send(gameWithAddedWhiteSpaces)

            expect(body.description).toEqual('THIS TOO!')
            expect(body.imageUrl).toEqual('https://www.pinballzarcade.com/wp-content/uploads/2018/01/744284a9f4fd8016f690df6b487b0b5a.jpg')
            expect(body.title).toEqual('Space should be cleaned up!')
        })

        it('should add a game with a matching title if other matching title isDeleted is set to true', async () => {
            await server.slonik.pool.query(sql`
                INSERT INTO
                    games (id, is_deleted, slug, title, created_at)
                VALUES (
                    ${gameIsDeletedButSameTitle.id},
                    ${gameIsDeletedButSameTitle.isDeleted},
                    ${gameIsDeletedButSameTitle.slug},
                    ${gameIsDeletedButSameTitle.title},
                    ${gameIsDeletedButSameTitle.createdAt}
                );
            `)

            const { body, status } = await supertest(server.server).post('/games').send(baseGame)

            expect(status).toEqual(201)
            expect(body.isDeleted).toBe(false)
            expect(body.title).toEqual(baseGame.title)
            expect(gameIsDeletedButSameTitle.title).toEqual(body.title)
            expect(gameIsDeletedButSameTitle.isDeleted).toBe(true)
        })
    })

    describe('failure cases', () => {
        const baseGameFailures: GameData = {
            id: uuidv4(),
            description: 'Testing for add game integration failures',
            imageUrl: null,
            isDeleted: false,
            slug: 'failures-add-game-title',
            title: 'failures add game title',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        let createGame: Disposable<unknown>[]

        beforeEach(async () => {
            createGame = await Promise.all([gameFactory(server.slonik.pool, baseGameFailures)])
        })

        afterEach(async () => {
            await disposeAll(createGame)
        })

        it('throws an API error when trying to add a game with an invalid UUID', async () => {
            const gameWithInvalidUuid = { id: 'not-valid', title: 'Not gonna make it' }

            const { body, status } = await supertest(server.server).post('/games').send(gameWithInvalidUuid)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            // It errors out checking for the duplicate game which is why we see this message
            expect(body.message).toMatch(/ERROR CHECKING FOR DUPLICATE GAME/)
        })

        it('throws a conflict error when a uuid already exists', async () => {
            const gameWithDuplicateUuid = overrideValues<GameData>(baseGameFailures, { title: 'New title should not matter!' })

            const { body, status } = await supertest(server.server).post('/games').send(gameWithDuplicateUuid)

            expect(mockHandleDuplicateEntryError).toHaveBeenCalled()
            expect(status).toEqual(409)
            expect(body.error).toEqual('Conflict')
            expect(body.message).toMatch(/CONFLICT ERROR/)
        })

        it('throws a conflict error when trying to add a game with a matching title', async () => {
            const gameWthMatchingTitle = overrideValues<GameData>(baseGameFailures, { id: uuidv4() })

            const { body, status } = await supertest(server.server).post('/games').send(gameWthMatchingTitle)

            expect(mockHandleDuplicateEntryError).toHaveBeenCalled()
            expect(status).toEqual(409)
            expect(body.error).toEqual('Conflict')
            expect(body.message).toMatch(/CONFLICT ERROR/)
        })

        it('throws a validation error when no title is sent in the JSON request body', async () => {
            const gameWithoutTitle = { id: uuidv4() }

            const { body, status } = await supertest(server.server).post('/games').send(gameWithoutTitle)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR/)
        })

        it('throws a validation error when title is an empty string', async () => {
            // Let's also test with someone trying to put in a long, empty string
            // whitespace should be cleaned up and we'll be left with an empty string
            const gameWithEmptyStringTitle = { id: uuidv4(), title: '       ' }

            const { body, status } = await supertest(server.server).post('/games').send(gameWithEmptyStringTitle)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR/)
        })
    })
})

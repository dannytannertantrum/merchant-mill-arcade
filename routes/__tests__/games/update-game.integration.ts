import { sql } from 'slonik'
import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { GameData } from '../../../common/games.types'
import { gameFactory } from '../test-utilities/factories/game-factory'
import {
    mockHandleApiError,
    mockHandleDuplicateEntryError,
    mockHandleValidationError
} from '../__mocks__/customErrorMocks'
import { overrideValues } from '../../../utilities/overrides'
import server from '../../../app'


describe('PUT /games', () => {

    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    describe('success cases', () => {
        let createGames: Disposable<unknown>[]
        let baseGame: GameData = {
            id: uuidv4(),
            description: 'Testing for update game integration',
            imageUrl: null,
            isDeleted: false,
            slug: 'update-game-title',
            title: 'Update game title',
            createdAt: new Date().toISOString(),
            updatedAt: new Date('1999-06-01').toISOString()
        }
        let updatedGame: GameData,
            gameIsDeleted: GameData

        updatedGame = overrideValues<GameData>(baseGame, {
            description: 'New description here!',
            imageUrl: 'https://www.arcade-museum.com/images/118/1181242171127.jpg',
            title: 'Updated game title should pass AND PRESERVE CAPS!'
        })
        gameIsDeleted = overrideValues<GameData>(baseGame, { id: uuidv4(), isDeleted: true, title: 'deleted game title', updatedAt: null })

        beforeEach(async () => {
            createGames = await Promise.all([gameFactory(server.slonik.pool, baseGame), gameFactory(server.slonik.pool, gameIsDeleted)])
        })

        afterEach(async () => {
            await disposeAll(createGames)
            await server.slonik.pool.query(sql`
                DELETE FROM games
                WHERE id IN(
                    ${updatedGame.id}
                );
            `)
        })

        it('should update description, imageUrl and title, preserving capitalization', async () => {
            const { body, status } = await supertest(server.server).put(`/games/${updatedGame.id}`).send(updatedGame)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(baseGame.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(baseGame.id)
            expect(body.description).toEqual(updatedGame.description)
            expect(body.description).not.toEqual(baseGame.description)
            expect(body.imageUrl).toEqual(updatedGame.imageUrl)
            expect(body.imageUrl).not.toEqual(baseGame.imageUrl)
            expect(body.title).toEqual(updatedGame.title)
            expect(body.title).not.toEqual(baseGame.title)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
            expect(body.id).toEqual(baseGame.id)
        })

        it('should update updatedAt if only description is changed', async () => {
            const onlyDescriptionChange = overrideValues<GameData>(baseGame, { description: 'new, eh?' })

            const { body, status } = await supertest(server.server).put(`/games/${updatedGame.id}`).send(onlyDescriptionChange)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(baseGame.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(baseGame.id)
            expect(body.description).toEqual(onlyDescriptionChange.description)
            expect(body.description).not.toEqual(baseGame.description)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
            expect(body.id).toEqual(baseGame.id)
        })

        it('should update updatedAt if only title is changed', async () => {
            const onlyTitleChange = overrideValues<GameData>(baseGame, { title: 'new, eh?' })

            const { body, status } = await supertest(server.server).put(`/games/${updatedGame.id}`).send(onlyTitleChange)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(baseGame.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(baseGame.id)
            expect(body.title).toEqual(onlyTitleChange.title)
            expect(body.title).not.toEqual(baseGame.title)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
            expect(body.id).toEqual(baseGame.id)
        })

        it('should update updatedAt if only image url is changed', async () => {
            const onlyImageUrlChange = overrideValues<GameData>(baseGame, { imageUrl: 'https://new.com/new-eh.jpg' })

            const { body, status } = await supertest(server.server).put(`/games/${updatedGame.id}`).send(onlyImageUrlChange)

            const newUpdatedAt = new Date(body.updatedAt)
            // @ts-ignore - we know oldUpdatedAt exists
            const oldUpdatedAt = new Date(baseGame.updatedAt)

            expect(status).toEqual(200)
            expect(body.id).toEqual(baseGame.id)
            expect(body.imageUrl).toEqual(onlyImageUrlChange.imageUrl)
            expect(body.imageUrl).not.toEqual(baseGame.imageUrl)
            // @ts-ignore - we know oldUpdatedAt exists
            expect(newUpdatedAt > oldUpdatedAt).toBe(true)
            expect(body.id).toEqual(baseGame.id)
        })

        // This test is necessary in case a user submits the exact same data
        // e.g. someone goes to edit, realizes they don't want to make changes, and save it
        it('should not alter updatedAt if the title, description, and image url remain the same', async () => {
            const { body, status } = await supertest(server.server).put(`/games/${updatedGame.id}`).send(baseGame)

            expect(status).toEqual(200)
            expect(body.title).toEqual(baseGame.title)
            expect(body.description).toEqual(baseGame.description)
            expect(body.imageUrl).toEqual(baseGame.imageUrl)
            expect(body.updatedAt).toEqual(baseGame.updatedAt)
        })

        it('should update a game if the title is changed to an existing title that is marked deleted', async () => {
            const gameWithMatchingTitle = overrideValues<GameData>(baseGame, { title: gameIsDeleted.title })

            const { body, status } = await supertest(server.server).put(`/games/${gameIsDeleted.id}`).send(gameWithMatchingTitle)

            expect(status).toEqual(200)
            expect(body.title).toEqual(gameWithMatchingTitle.title)
            expect(body.title).toEqual(gameIsDeleted.title)
            expect(body.updatedAt).toBeDefined()
        })
    })

    describe('failure cases', () => {
        const baseGameFailures: GameData = {
            id: uuidv4(),
            description: 'Testing updated game integration failures',
            imageUrl: null,
            isDeleted: false,
            slug: 'failures-update-game-title',
            title: 'failures update game title',
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

        it('throws an API error when trying to update a game with an invalid UUID', async () => {
            const gameWithInvalidUuid = overrideValues<GameData>(baseGameFailures, { id: 'not-a-valid-uuid' })

            const { body, status } = await supertest(server.server).put(`/games/${gameWithInvalidUuid.id}`).send(gameWithInvalidUuid)

            expect(mockHandleApiError).toHaveBeenCalled()
            expect(status).toEqual(500)
            expect(body.error).toEqual('Internal Server Error')
            expect(body.message).toMatch(/API ERROR CHECKING QUERY FOR NO CHANGES/)
        })

        it('throws a conflict error when trying to add a game with a matching title', async () => {
            const gameWthMatchingTitle = overrideValues<GameData>(baseGameFailures, { id: uuidv4() })

            const { body, status } = await supertest(server.server).put(`/games/${gameWthMatchingTitle.id}`).send(gameWthMatchingTitle)

            expect(mockHandleDuplicateEntryError).toHaveBeenCalled()
            expect(status).toEqual(409)
            expect(body.error).toEqual('Conflict')
            expect(body.message).toMatch(/CONFLICT ERROR/)
        })

        it('throws a validation error trying to update with an empty title', async () => {
            const gameWithoutTitle = overrideValues<GameData>(baseGameFailures, { title: '' })

            const { body, status } = await supertest(server.server).put(`/games/${gameWithoutTitle.id}`).send(gameWithoutTitle)

            expect(mockHandleValidationError).toHaveBeenCalled()
            expect(status).toEqual(400)
            expect(body.error).toEqual('Bad Request')
            expect(body.message).toMatch(/VALIDATION ERROR/)
        })

        it('throws a not found error when trying to update a game with a valid uuid that does not exist in the db', async () => {
            const gameWithNonExistingUuid = { id: uuidv4(), title: 'blah' }

            const { body, status } = await supertest(server.server).put(`/games/${gameWithNonExistingUuid.id}`).send(gameWithNonExistingUuid)

            expect(status).toEqual(404)
            expect(body.error).toEqual('Not Found')
            expect(body.message).toEqual('NOT FOUND ERROR OnSend /PUT game: Game not found.')
        })
    })
})

import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Disposable, disposeAll } from '../test-utilities/disposables'
import { gameFactory } from '../test-utilities/factories/game-factory'
import server from '../../../app'
import { mockHandleNotFoundError } from '../__mocks__/customErrorMocks'
import { GameData } from '../../types/games.types'
import { getGameById } from '../../common-queries'


describe('DELETE /games/id', () => {
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
            description: 'Some seriously bad dudes, brah',
            imageUrl: null,
            isDeleted: false,
            slug: 'bad-dudes',
            title: 'Bad Dudes',
            createdAt: new Date().toISOString(),
            updatedAt: null
        }

        beforeEach(async () => {
            createGame = await Promise.all([gameFactory(server.slonik.pool, game)])
        })

        afterEach(async () => {
            await disposeAll(createGame)
        })

        it('soft deletes a game in the database', async () => {
            const deleteResult = await supertest(server.server).delete(`/games/${game.id}`)
            const updatedGame = await getGameById(server.slonik.pool, game.id)

            expect(deleteResult.status).toEqual(200)
            expect(deleteResult.text).toContain(`The game "${game.title}" with id ${game.id} has been removed`)
            expect(updatedGame?.isDeleted).toBe(true)
            expect(updatedGame?.updatedAt).not.toBeNull()
        })
    })

    describe('failure cases', () => {
        it('sends a 404 and throws a not found error when the game does not exist', async () => {
            const noGameHereId = uuidv4()

            const { body, status } = await supertest(server.server).delete(`/games/${noGameHereId}`)

            expect(mockHandleNotFoundError).toHaveBeenCalled()
            expect(status).toBe(404)
            expect(body.message).toMatch(/NOT FOUND ERROR OnSend \/DELETE game/)
        })
    })
})

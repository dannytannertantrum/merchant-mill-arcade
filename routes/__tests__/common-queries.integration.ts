import { v4 as uuidv4 } from 'uuid'

import { getGameById, getScoreById, queryForActiveGame } from '../common-queries'
import { Disposable, disposeAll } from './test-utilities/disposables'
import { GameData } from '../../common/games.types'
import { gameFactory } from './test-utilities/factories/game-factory'
import { overrideValues } from '../../utilities/overrides'
import { ScoreData } from '../../common/scores.types'
import { scoreFactory } from './test-utilities/factories/score-factory'
import server from '../../app'


describe('COMMONG QUERIES', () => {
    beforeAll(async () => {
        await server.ready()
    })

    afterAll(async () => {
        await server.close()
    })

    const game: GameData = {
        id: uuidv4(),
        description: 'matching foreign keyyyyy',
        imageUrl: null,
        isDeleted: false,
        slug: 'game-for-common-query-purposes',
        title: 'Game for common query purposes',
        createdAt: new Date().toISOString(),
        updatedAt: null
    }
    const deletedGame: GameData = {
        id: uuidv4(),
        description: 'Testing a deleted title',
        imageUrl: null,
        isDeleted: true,
        slug: 'test-deleted-game-common-queries',
        title: 'Test deleted game for common queries',
        createdAt: new Date().toISOString(),
        updatedAt: null
    }
    const score: ScoreData = {
        id: uuidv4(),
        game: game.id,
        initials: 'GLC',
        score: 1283794222,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    }

    let createGames: Disposable<unknown>[]
    let createScore: Disposable<unknown>[]

    // Don't forget to add the game first and delete the score first
    beforeEach(async () => {
        createGames = await Promise.all([
            gameFactory(server.slonik.pool, deletedGame),
            gameFactory(server.slonik.pool, game)
        ])
        createScore = await Promise.all([scoreFactory(server.slonik.pool, score)])
    })

    afterEach(async () => {
        await disposeAll(createScore)
        await disposeAll(createGames)
    })
    describe('getGameById', () => {
        it('returns a game when given a valid uuid in the database', async () => {
            const result = await getGameById(server.slonik.pool, game.id)

            expect(result).toBeDefined()
            expect(result?.title).toEqual(game.title)
        })

        it('returns null when no game exists', async () => {
            const result = await getGameById(server.slonik.pool, uuidv4())

            expect(result).toBeNull()
        })
    })

    describe('getScoreById', () => {
        it('returns a score when given a valid uuid in the database', async () => {
            const result = await getScoreById(server.slonik.pool, score.id)

            expect(result).toBeDefined()
            expect(result?.initials).toEqual(score.initials)
        })

        it('returns null when no score exists', async () => {
            const result = await getScoreById(server.slonik.pool, uuidv4())

            expect(result).toBeNull()
        })
    })

    describe('queryForActiveGame', () => {
        describe('with an existing game in the database', () => {
            it('returns isActive true and game data if the game is not deleted', async () => {
                // Remember - we inserted "gane" into the database via our gameFactory
                const result = await queryForActiveGame({
                    pool: server.slonik.pool,
                    title: game.title,
                    id: game.id
                })

                expect(result.isActive).toBe(true)
                expect(result.game).not.toBeNull()
                expect(result.game?.title).toEqual(game.title)
            })

            it('returns isActive false and game data if the game is deleted', async () => {
                const result = await queryForActiveGame({
                    pool: server.slonik.pool,
                    title: deletedGame.title,
                    id: deletedGame.id
                })

                expect(result.isActive).toBe(false)
                expect(result.game).not.toBeNull()
                expect(result.game?.title).toBeDefined()
            })
        })

        describe('with a game that does not exist in the database', () => {
            it('returns isActive true and game data if there is a matching title and the title is not deleted', async () => {
                // Make sure matchingTitle does not exist in the database - we did not add it with our factory
                const matchingTitle = overrideValues<GameData>(game, { id: uuidv4() })
                const result = await queryForActiveGame({
                    pool: server.slonik.pool,
                    title: matchingTitle.title,
                    id: matchingTitle.id
                })

                expect(result.isActive).toBe(true)
                expect(result.game).toBeNull()
            })

            it('returns isActive false and no game data if there is a matching title and it is deleted', async () => {
                // Remember from our factory that "deletedGame" is in our database
                const gameMatchingDeletedTitle = overrideValues<GameData>(deletedGame, { id: uuidv4() })
                const result = await queryForActiveGame({
                    pool: server.slonik.pool,
                    title: gameMatchingDeletedTitle.title,
                    id: gameMatchingDeletedTitle.id
                })

                expect(result.isActive).toBe(false)
                expect(result.game).toBeNull()
            })
        })
    })
})

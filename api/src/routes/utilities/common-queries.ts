import { DatabasePoolType, sql } from 'slonik'

import { handleApiError } from '../../custom-errors'
import { GameData } from '../../types/games.types'
import { ScoreData } from '../../types/scores.types'


interface DuplicateGameCheck {
    pool: DatabasePoolType
    title: string
    isPutRequest: boolean
    id?: string
}

interface DuplicateGameReturnValue {
    isDuplicate: boolean
    game: GameData | null
}

const getGameById = async (pool: DatabasePoolType, id: string): Promise<GameData | null> => {
    const result = await pool.maybeOne(sql<GameData>`
        SELECT * FROM games
        WHERE id = ${id};
    `)

    if (result !== null) {
        return {
            ...result,
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: result.updatedAt && new Date(result.updatedAt).toISOString()
        }
    }

    return result
}

const getScoreById = async (pool: DatabasePoolType, id: string): Promise<ScoreData | null> => {
    const result = await pool.maybeOne(sql<ScoreData>`
        SELECT * FROM scores
        WHERE id = ${id};
    `)

    if (result !== null) {
        return {
            ...result,
            createdAt: new Date(result.createdAt).toISOString(),
            updatedAt: result.updatedAt && new Date(result.updatedAt).toISOString()
        }
    }

    return result
}

const queryForDuplicateGame = async ({ pool, title, id, isPutRequest }: DuplicateGameCheck): Promise<DuplicateGameReturnValue> => {
    let gameIdExists: GameData | null = null
    title = title.toLowerCase()

    if (id) {
        gameIdExists = await getGameById(pool, id).catch(reason =>
            handleApiError(`The following error occurred when searching for a duplicate game by id: ${reason}`)
        )
    }

    const titleQuery = await pool.query(sql<GameData>`
        SELECT title, is_deleted
        FROM games
        WHERE LOWER(title) = ${title};
    `).catch(reason => handleApiError(`The following error occurred when searching for a duplicate game by title: ${reason}`))

    const titleIsActive = titleQuery.rows.some(game => game.isDeleted === false)

    if ((gameIdExists && gameIdExists.isDeleted === false && !isPutRequest) || (titleIsActive)) {
        return { isDuplicate: true, game: gameIdExists }
    } else {
        return { isDuplicate: false, game: gameIdExists }
    }
}

export {
    DuplicateGameReturnValue,
    getGameById,
    getScoreById,
    queryForDuplicateGame
}

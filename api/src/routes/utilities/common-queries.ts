import { DatabasePoolType, sql } from 'slonik'

import { handleApiError } from '../../custom-errors'
import { GameData } from '../../types/games.types'
import { ScoreData } from '../../types/scores.types'


interface ActiveGameCheck {
    pool: DatabasePoolType
    title: string
    id?: string
}

interface ActiveGameReturnValue {
    isActive: boolean
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

const queryForActiveGame = async ({ pool, title, id }: ActiveGameCheck): Promise<ActiveGameReturnValue> => {
    let game: GameData | null = null
    title = title.toLowerCase()

    if (id) {
        game = await getGameById(pool, id).catch(reason =>
            handleApiError(`API ERROR: The following error occurred when searching for an active game by id: ${reason}`)
        )
    }

    const titleQuery = await pool.query(sql<GameData>`
        SELECT title, is_deleted
        FROM games
        WHERE LOWER(title) = ${title};
    `).catch(reason => handleApiError(`API ERROR: The following error occurred when searching for an active game by title: ${reason}`))

    const titleIsActive = titleQuery.rows.some(game => game.isDeleted === false)

    if (titleIsActive) {
        return { isActive: true, game }
    } else {
        return { isActive: false, game }
    }
}

export {
    ActiveGameReturnValue,
    getGameById,
    getScoreById,
    queryForActiveGame
}

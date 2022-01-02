import { DatabasePoolType, sql } from 'slonik'

import { GameData } from '../types/games.types'


type DuplicateGameCheck = {
    pool: DatabasePoolType
    title: string
    id?: string
}

const getGameById = async (pool: DatabasePoolType, id: string): Promise<GameData> => {
    const result = await pool.one(sql<GameData>`
        SELECT * FROM games
        WHERE id = ${id}
    `)

    return result
}

const queryForDuplicateGame = async ({ pool, title, id }: DuplicateGameCheck): Promise<Boolean> => {
    let existingGame: GameData | undefined
    title = title.toLowerCase()

    try {
        if (id) {
            existingGame = await getGameById(pool, id)
        }

        const titleQuery = await pool.query(sql<GameData>`
            SELECT * FROM games WHERE LOWER(title) = ${title}
        `)

        const titleExists = titleQuery.rows.length > 0
        const titleIsActive = titleQuery.rows.some(game => game.isDeleted === false)

        if (existingGame && existingGame.title.toLowerCase() === title) {
            return false
        }

        return !!(titleExists && titleIsActive)
    } catch (err) {
        throw new Error(`The following error occurred when searching for a duplicate game: ${err}`)
    }
}

export {
    getGameById,
    queryForDuplicateGame
}

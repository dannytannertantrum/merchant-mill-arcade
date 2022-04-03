import { DatabasePoolType, sql } from 'slonik'

import { GameData } from '../../types/games.types'
import { Disposable } from '../disposables'


const gameFactory = async (
    pool: DatabasePoolType,
    { id, description, slug, title }: { id: string, description: string, slug: string, title: string }
): Promise<Disposable<({ id: string })>> => {
    await pool.query(sql<GameData>`
        INSERT INTO
            games (id, description, slug, title)
        VALUES
            (${id}, ${description}, ${slug}, ${title})
    `)

    return {
        data: { id },
        cleanUp: async () => {
            await pool.query(sql<GameData>`
                DELETE FROM games
                WHERE id = ${id}
            `)
        }
    }
}

export {
    gameFactory
}

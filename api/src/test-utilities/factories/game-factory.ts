import { DatabasePoolType, sql } from 'slonik'

import { GameData } from '../../types/games.types'
import { Disposable } from '../disposables'


const gameFactory = async (
    pool: DatabasePoolType,
    { id, description, isDeleted, slug, title, createdAt }: { id: string, description: string, isDeleted: boolean, slug: string, title: string, createdAt: string }
): Promise<Disposable<({ id: string })>> => {
    await pool.query(sql<GameData>`
        INSERT INTO
            games (id, description, is_deleted, slug, title, created_at)
        VALUES
            (${id}, ${description}, ${isDeleted}, ${slug}, ${title}, ${createdAt}::timestamptz);
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

import { DatabasePoolType, sql } from 'slonik'

import { GameData } from '../../../types/games.types'
import { Disposable } from '../disposables'


const gameFactory = async (
    pool: DatabasePoolType,
    { id, description, imageUrl, isDeleted, slug, title, createdAt, updatedAt }: GameData
): Promise<Disposable<({ id: string })>> => {
    await pool.query(sql<GameData>`
        INSERT INTO
            games (id, description, image_url, is_deleted, slug, title, created_at, updated_at)
        VALUES
            (${id}, ${description}, ${imageUrl}, ${isDeleted}, ${slug}, ${title}, ${createdAt}::timestamptz, ${updatedAt}::timestamptz);
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

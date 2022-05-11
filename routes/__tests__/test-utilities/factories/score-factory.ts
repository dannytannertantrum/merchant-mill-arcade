import { DatabasePoolType, sql } from 'slonik'

import { ScoreData } from '../../../types/scores.types'
import { Disposable } from '../disposables'


const scoreFactory = async (
    pool: DatabasePoolType,
    { id, game, isDeleted, initials, score, createdAt, updatedAt }: ScoreData
): Promise<Disposable<({ id: string })>> => {
    await pool.query(sql<ScoreData>`
        INSERT INTO
            scores (id, game, is_deleted, initials, score, created_at, updated_at)
        VALUES
            (${id}, ${game}, ${isDeleted}, ${initials}, ${score}, ${createdAt}::timestamptz, ${updatedAt}::timestamptz);
    `)

    return {
        data: { id },
        cleanUp: async () => {
            await pool.query(sql<ScoreData>`
                DELETE FROM scores
                WHERE id = ${id}
            `)
        }
    }
}

export {
    scoreFactory
}

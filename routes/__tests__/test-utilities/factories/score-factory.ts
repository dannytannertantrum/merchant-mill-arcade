import { DatabasePoolType, sql } from 'slonik'

import { ScoreData } from '../../../../common/scores.types'
import { Disposable } from '../disposables'


const scoreFactory = async (
    pool: DatabasePoolType,
    { id, gameId, isDeleted, initials, score, createdAt, updatedAt }: ScoreData
): Promise<Disposable<({ id: string })>> => {
    await pool.query(sql<ScoreData>`
        INSERT INTO
            scores (id, game_id, is_deleted, initials, score, created_at, updated_at)
        VALUES
            (${id}, ${gameId}, ${isDeleted}, ${initials}, ${score}, ${createdAt}::timestamptz, ${updatedAt}::timestamptz);
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

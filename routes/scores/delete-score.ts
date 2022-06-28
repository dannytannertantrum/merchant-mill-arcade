import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleError, handleNotFoundError } from '../../utilities/custom-errors'
import { ScoreData, ScoreSchema } from '../../common/scores.types'


const schema = { response: { 200: ScoreSchema } }

const softDeleteScore = async (
    pool: DatabasePoolType,
    id: string,
    updatedAt: string
): Promise<ScoreData | null> => {
    const result = await pool.maybeOne(sql<ScoreData>`
        UPDATE scores
        SET
            is_deleted = TRUE,
            updated_at = ${updatedAt}::timestamptz
        WHERE id = ${id}
        RETURNING *;
    `)

    return result
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<ScoreData, 'id'>, Reply: ScoreData | Error }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            try {

                const { id } = request.params
                const updatedAt = new Date().toISOString()

                const scoreToDelete = await softDeleteScore(server.slonik.pool, id, updatedAt)

                scoreToDelete
                    ? reply.send(scoreToDelete)
                    : handleNotFoundError(`OnSend /DELETE score with id ${id}. Score not found.`)

            } catch (reason) {
                handleError('ERROR DELETING SCORE: ', reason, reply)
            }
        }
    )
}

export {
    softDeleteScore
}

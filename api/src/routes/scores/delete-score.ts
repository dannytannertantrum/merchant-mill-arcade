import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleApiError, handleNotFoundError } from '../../custom-errors'
import { ScoreData } from '../../types/scores.types'
import { SoftDeleteSchema } from '../../types/shared.types'


const schema = { response: { 200: SoftDeleteSchema } }

const softDeleteScore = async (
    pool: DatabasePoolType,
    id: string,
    updatedAt: string
): Promise<Pick<ScoreData, 'id' | 'score'> | null> => {
    const result = await pool.maybeOne(sql<ScoreData>`
        UPDATE scores
        SET
            is_deleted = TRUE,
            updated_at = ${updatedAt}
        WHERE id = ${id}
        RETURNING id, score;
    `)

    return result
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<ScoreData, 'id'> }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            const updatedAt = new Date().toISOString()

            const scoreToDelete = await softDeleteScore(server.slonik.pool, id, updatedAt).catch(reason =>
                handleApiError(`ERROR DELETING SCORE: ${reason}`)
            )

            scoreToDelete
                ? reply.send(`Score ${scoreToDelete.score} with id ${id} has been removed from the Merchant Mill Arcade!`)
                : reply.code(404).send(handleNotFoundError(`ERROR OnSend /DELETE score with id ${id}. Score not found.`))
        }
    )
}

export {
    softDeleteScore
}

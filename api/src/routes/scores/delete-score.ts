import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleApiError, handleNotFoundError } from '../../custom-errors'
import { ScoreData } from '../../types/scores.types'
import { SoftDeleteSchema } from '../../types/shared.types'


const schema = { response: { 200: SoftDeleteSchema } }

const softDeleteScore = async (
    pool: DatabasePoolType,
    id: string
): Promise<Pick<ScoreData, 'id'> | null> => {
    const result = await pool.maybeOne(sql<ScoreData>`
        UPDATE scores
        SET is_deleted = TRUE
        WHERE id = ${id}
        RETURNING id;
    `)

    return result
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<ScoreData, 'id'>, Reply: string | Error }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            const scoreToDelete = await softDeleteScore(server.slonik.pool, id).catch(reason =>
                handleApiError(`ERROR DELETING SCORE: ${reason}`)
            )

            scoreToDelete
                ? reply.send(`Score with id ${id} has been removed from the Merchant Mill Arcade!`)
                : reply.code(404).send(handleNotFoundError(`ERROR OnSend /DELETE score with id ${id}. Score not found.`))
        }
    )
}

export {
    softDeleteScore
}

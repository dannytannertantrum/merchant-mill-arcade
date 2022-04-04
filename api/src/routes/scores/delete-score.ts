import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { GameData } from '../../types/games.types'

import { ScoreData } from '../../types/scores.types'
import { SoftDeleteSchema } from '../../types/shared.types'
import { ReplyMessage } from '../../types/shared.types'


const schema = { response: { 200: SoftDeleteSchema } }

const softDeleteScore = async (pool: DatabasePoolType, id: string): Promise<void> => {
    await pool.query(sql<ScoreData>`
        UPDATE scores
        SET is_deleted = TRUE
        WHERE id = ${id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<ScoreData, 'id'>, Reply: Partial<ReplyMessage<GameData>> }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            try {
                await softDeleteScore(server.slonik.pool, id)
                reply.send({message: `Score with ${id} has been removed from the Merchant Mill Arcade`})
            } catch (err) {
                throw new Error(`Delete score error: ${err}`)
            }

        })
}

export {
    softDeleteScore
}

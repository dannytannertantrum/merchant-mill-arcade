import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { GameData } from '../../types/games.types'
import { SoftDeleteSchema } from '../../types/shared.types'
import { ReplyMessage } from '../../types/shared.types'


const schema = { response: { 200: SoftDeleteSchema } }

const softDeleteGame = async (pool: DatabasePoolType, id: string): Promise<void> => {
    await pool.query(sql<GameData>`
        UPDATE games
        SET is_deleted = TRUE
        WHERE id = ${id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<GameData, 'id'>, Reply: ReplyMessage }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            try {
                await softDeleteGame(server.slonik.pool, id)
                reply.send({ message: `Arcade game with id ${id} has been removed from the Merchant Mill Arcade` })
            } catch (err) {
                throw new Error(`Delete game error: ${err}`)
            }
        }
    )
}

export {
    softDeleteGame
}

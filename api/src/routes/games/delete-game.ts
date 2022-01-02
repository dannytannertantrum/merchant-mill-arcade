import { FastifyInstance } from "fastify"
import { DatabasePoolType, sql } from 'slonik'

import { GameData, SoftDeleteGameSchema, ReplyMessage } from "../../types/games.types"


const schema = { response: { 200: SoftDeleteGameSchema } }

const softDeleteGame = async (pool: DatabasePoolType, id: string): Promise<void> => {
    await pool.query(sql<GameData>`
        UPDATE games
        SET is_deleted = TRUE
        WHERE id = ${id}
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: GameData, Reply: ReplyMessage }>(
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

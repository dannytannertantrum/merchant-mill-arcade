import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { GameData, GameSchema } from '../../common/games.types'
import { handleError, handleNotFoundError } from '../../utilities/custom-errors'


const schema = { response: { 200: GameSchema } }

const softDeleteGame = async (
    pool: DatabasePoolType,
    id: string,
    updatedAt: string
): Promise<GameData | null> => {
    const result = await pool.maybeOne(sql<GameData>`
        UPDATE games
        SET
            is_deleted = TRUE,
            updated_at = ${updatedAt}::timestamptz
        WHERE id = ${id}
        RETURNING *;
    `)

    return result
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<GameData, 'id'>, Reply: GameData | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            try {

                const { id } = request.params
                const updatedAt = new Date().toISOString()

                const gameToDelete = await softDeleteGame(server.slonik.pool, id, updatedAt)

                gameToDelete
                    ? reply.send(gameToDelete)
                    : handleNotFoundError(`OnSend /DELETE game with id ${id}. Game not found.`)

            } catch (reason) {
                handleError('ERROR DELETING GAME: ', reason, reply)
            }
        }
    )
}

export {
    softDeleteGame
}

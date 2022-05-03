import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { GameData } from '../../types/games.types'
import { SoftDeleteSchema } from '../../types/shared.types'
import { handleApiError, handleNotFoundError } from '../../custom-errors'


const schema = { response: { 200: SoftDeleteSchema } }

const softDeleteGame = async (
    pool: DatabasePoolType, id: string
): Promise<Pick<GameData, 'title' | 'id'> | null> => {
    const result = await pool.maybeOne(sql<GameData>`
        UPDATE games
        SET is_deleted = TRUE
        WHERE id = ${id}
        RETURNING title, id;
    `)

    return result
}

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: Pick<GameData, 'id'>, Reply: string | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            const gameToDelete = await softDeleteGame(server.slonik.pool, id).catch(reason =>
                handleApiError(`ERROR DELETING GAME: ${reason}`)
            )

            gameToDelete
                ? reply.send(`The game "${gameToDelete.title}" with id ${id} has been removed from the Merchant Mill Arcade!`)
                : reply.code(404).send(handleNotFoundError(`ERROR OnSend /DELETE game with id ${id}. Game not found.`))
        }
    )
}

export {
    softDeleteGame
}

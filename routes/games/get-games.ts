import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { AllGamesSchema, GameData, AllGamesData } from '../types/games.types'
import { handleApiError } from '../../utilities/custom-errors'


const schema = { response: { 200: AllGamesSchema } }

const getAllGames = async (pool: DatabasePoolType): Promise<AllGamesData | []> => {
    const result = await pool.query(sql<GameData>`
        SELECT * FROM games;
    `)

    if (result.rows === []) return []
    return result.rows.map(game => {
        return {
            ...game,
            createdAt: new Date(game.createdAt).toISOString(),
            updatedAt: game.updatedAt && new Date(game.updatedAt).toISOString()
        }
    })
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/games',
        { schema },
        async (_request, reply) => {
            const games = await getAllGames(server.slonik.pool).catch(reason =>
                handleApiError(`API ERROR GETTING GAMES: ${reason}`)
            )

            reply.send(games)
        }
    )
}

export {
    getAllGames
}

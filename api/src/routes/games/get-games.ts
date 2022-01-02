import { FastifyInstance } from "fastify"
import { DatabasePoolType, sql } from "slonik"

import { AllGamesSchema, GameData } from '../../types/games.types'


const schema = { response: { 200: AllGamesSchema } }

const getGames = async (pool: DatabasePoolType): Promise<readonly GameData[]> => {
    const result = await pool.query(sql<GameData>`
        SELECT * FROM games;
    `)

    return result.rows
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/games',
        { schema },
        async (request, reply) => {
            try {
                const games = await getGames(server.slonik.pool)
                reply.send(games)
            } catch (err) {
                throw new Error(`Get games error: ${err}`)
            }
        }
    )
}

export {
    getGames
}

import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { AllGamesSchema, GameData, AllGamesData } from '../../types/games.types'


const schema = { response: { 200: AllGamesSchema } }

const getAllGames = async (pool: DatabasePoolType): Promise<Readonly<AllGamesData>> => {
    const result = await pool.query(sql<GameData>`
        SELECT * FROM games;
    `)

    return result.rows
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{Reply: Readonly<AllGamesData>}>(
        '/games',
        { schema },
        async (request, reply) => {
            try {
                const games = await getAllGames(server.slonik.pool)
                reply.send(games)
            } catch (err) {
                throw new Error(`Get games error: ${err}`)
            }
        }
    )
}

export {
    getAllGames
}

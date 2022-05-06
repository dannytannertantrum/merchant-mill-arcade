import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { AllGamesSchema, GameData, AllGamesData } from '../../types/games.types'
import { handleApiError } from '../../custom-errors'


const schema = { response: { 200: AllGamesSchema } }

const getAllGames = async (pool: DatabasePoolType): Promise<Readonly<AllGamesData | []>> => {
    const result = await pool.query(sql<GameData>`
        SELECT * FROM games;
    `)

    return result.rows
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/games',
        { schema },
        async (_request, reply) => {
            const games = await getAllGames(server.slonik.pool).catch(reason =>
                handleApiError(`ERROR GETTING GAMES: ${reason}`)
            )

            reply.send(JSON.stringify(games))
        }
    )
}

export {
    getAllGames
}

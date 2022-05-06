import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { AllGamesSchema, GameData, AllGamesData } from '../../types/games.types'
import { handleApiError, handleNotFoundError } from '../../custom-errors'


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
    server.get<{ Reply: Readonly<AllGamesData | Error> }>(
        '/games',
        { schema },
        async (request, reply) => {
            const games = await getAllGames(server.slonik.pool).catch(reason =>
                handleApiError(`ERROR GETTING GAMES: ${reason}`)
            )

            games
                ? reply.send(games)
                : reply.code(404).send(handleNotFoundError(`ERROR OnSend /GET games: Games not found.`))
        }
    )
}

export {
    getAllGames
}

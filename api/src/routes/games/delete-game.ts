import { FastifyInstance } from "fastify"

import games from '../../../games'
import { AllGamesSchema, GameData, GameSchema } from "../../types/games.types"

const schema = { response: { 200: GameSchema } }
let allGames: GameData[] = games

export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: GameData }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = await request.params
            allGames.filter(game => game.id !== id)

            reply.send(`Game ${id} removed`)
        }
    )
}

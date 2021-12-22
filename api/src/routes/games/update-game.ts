import { FastifyInstance } from "fastify"

import games from '../../../games'
import { GameData, GameSchema } from "../../types/games.types"

const schema = { response: { 200: GameSchema } }
let allGames: GameData[] = games

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: GameData, Body: GameData, Reply: GameData }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            const { title, description } = request.body
            const updatedAllGames = allGames.map(game => (game.id === id ? { id, title, description } : game))

            const gameToUpdate = updatedAllGames.find(game => game.id === id)
            
            reply.send(gameToUpdate)
        }
    )
}

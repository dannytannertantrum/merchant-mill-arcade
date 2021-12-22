import { FastifyInstance } from "fastify"
import { v4 as uuidv4 } from 'uuid'

import games from '../../../games'
import { GameData, GameSchema } from "../../types/games.types"


const schema = { response: { 200: GameSchema } }
let allGames: GameData[] = games

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: GameData, Reply: GameData}>(
        '/games',
        { schema },
        async (request, reply) => {
            const { title, description } = await request.body
            const gameToAdd = {
                id: uuidv4(),
                title,
                description
            }

            allGames = [...games, gameToAdd]

            reply.code(201).send(gameToAdd)
        }
    )
}

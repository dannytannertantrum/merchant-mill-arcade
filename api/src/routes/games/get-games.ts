import { FastifyInstance } from "fastify"

import games from '../../../games'
import { AllGamesSchema } from '../../types/games.types'


const schema = { response: { 200: AllGamesSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/games',
        { schema },
        async (request, reply) => {
            reply.send(games)
        }
    )
}

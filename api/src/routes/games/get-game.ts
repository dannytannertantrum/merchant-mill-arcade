import { FastifyInstance } from 'fastify'

import games from '../../../games'
import { GameData, GameSchema } from '../../types/games.types'

const schema = { response: { 200: GameSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{Params: GameData}>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            const gameToGet = games.find(game => game.id === id)

            reply.send(gameToGet)
        }
    )
}

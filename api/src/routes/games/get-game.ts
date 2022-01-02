import { FastifyInstance } from 'fastify'

import { GameData, GameSchema } from '../../types/games.types'
import { getGameById } from '../common-queries'


const schema = { response: { 200: GameSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: GameData }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            try {
                const game = await getGameById(server.slonik.pool, id)
                reply.send(game)
            } catch (err) {
                throw new Error(`Get game error: ${err}`)
            }
        }
    )
}

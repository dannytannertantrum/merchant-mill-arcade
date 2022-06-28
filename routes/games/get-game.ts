import { FastifyInstance } from 'fastify'

import { GameData, GameSchema } from '../../common/games.types'
import { getGameById } from '../common-queries'
import { handleError, handleNotFoundError } from '../../utilities/custom-errors'


const schema = { response: { 200: GameSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<GameData, 'id'>, Reply: GameData | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            try {

                const { id } = request.params

                const game = await getGameById(server.slonik.pool, id)

                game
                    ? reply.send(game)
                    : handleNotFoundError(`OnSend /GET game: Game not found.`)

            } catch (reason) {
                handleError('ERROR GETTING GAME: ', reason, reply)
            }
        }
    )
}

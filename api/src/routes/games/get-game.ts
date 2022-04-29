import { FastifyInstance } from 'fastify'

import { GameData, GameSchema } from '../../types/games.types'
import { getGameById } from '../utilities/common-queries'
import { handleApiError, handleNotFoundError } from '../../customErrors'


const schema = { response: { 200: GameSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<GameData, 'id'>, Reply: GameData | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            const game = await getGameById(server.slonik.pool, id).catch(reason =>
                handleApiError(`ERROR GETTING GAME: ${reason}`)
            )

            game
                ? reply.send(game)
                : reply.code(404).send(handleNotFoundError(`ERROR OnSend /GET game: Game not found.`))
        }
    )
}

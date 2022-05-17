import { FastifyInstance } from 'fastify'

import { GameData, GameSchema } from '../../common/games.types'
import { getGameById } from '../common-queries'
import { handleApiError, handleNotFoundError } from '../../utilities/custom-errors'


const schema = { response: { 200: GameSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<GameData, 'id'>, Reply: GameData | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            const game = await getGameById(server.slonik.pool, id).catch(reason =>
                handleApiError(`API ERROR GETTING GAME: ${reason}`)
            )

            game
                ? reply.send(game)
                : reply.code(404).send(handleNotFoundError(`NOT FOUND ERROR OnSend /GET game: Game not found.`))
        }
    )
}

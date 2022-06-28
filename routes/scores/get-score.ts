import { FastifyInstance } from 'fastify'

import { handleError, handleNotFoundError } from '../../utilities/custom-errors'
import { ScoreSchema, ScoreData } from '../../common/scores.types'
import { getScoreById } from '../common-queries'


const schema = { response: { 200: ScoreSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<ScoreData, 'id'>, Reply: ScoreData | Error }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            try {

                const { id } = request.params

                const score = await getScoreById(server.slonik.pool, id)

                score
                    ? reply.send(score)
                    : handleNotFoundError('OnSend /GET score: Score not found.')

            } catch (reason) {
                handleError('ERROR GETTING SCORE: ', reason, reply)
            }
        }
    )
}

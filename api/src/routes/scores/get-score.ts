import { FastifyInstance } from 'fastify'

import { handleApiError, handleNotFoundError } from '../../customErrors'
import { ScoreSchema, ScoreData } from '../../types/scores.types'
import { getScoreById } from '../utilities/common-queries'


const schema = { response: { 200: ScoreSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<ScoreData, 'id'>, Reply: ScoreData | Error }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            const score = await getScoreById(server.slonik.pool, id).catch(reason =>
                handleApiError(`ERROR GETTING SCORE: ${reason}`)
            )

            score
                ? reply.send(score)
                : reply.code(404).send(handleNotFoundError('ERROR OnSend /GET score: Score not found.'))
        })
}

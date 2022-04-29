import { FastifyInstance } from 'fastify'

import { ScoreSchema, ScoreData } from '../../types/scores.types'
import { getScoreById } from '../utilities/common-queries'


const schema = { response: { 200: ScoreSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<ScoreData, 'id'>, Reply: ScoreData }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            const score = await getScoreById(server.slonik.pool, id)
            if (score) reply.send(score)
        })
}

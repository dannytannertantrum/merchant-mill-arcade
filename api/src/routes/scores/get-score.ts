import { FastifyInstance } from 'fastify'

import { ScoreSchema, ScoreData } from '../../types/scores.types'
import { getScoreById } from '../common-queries'


const schema = { response: { 200: ScoreSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: Pick<ScoreData, 'id'>, Reply: ScoreData }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params

            try {
                const score = await getScoreById(server.slonik.pool, id)   
                reply.send(score)
            } catch (err) {
                throw new Error(`Get score error: ${err}`)
            }
        })
}

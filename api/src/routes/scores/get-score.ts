import { FastifyInstance } from 'fastify'

import scores from '../../../scores'
import { ScoreSchema, ScoreData } from '../../types/scores.types'

const schema = { response: { 200: ScoreSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Params: ScoreData }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = await request.params
            const scoreToGet = scores.find(score => score.id === id)

            reply.send(scoreToGet)
        })
}

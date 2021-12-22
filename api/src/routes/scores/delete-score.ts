import { FastifyInstance } from 'fastify'

import scores from '../../../scores'
import { ScoreSchema, ScoreData } from '../../types/scores.types'

const schema = { response: { 200: ScoreSchema } }
let allScores = scores


export default async (server: FastifyInstance): Promise<void> => {
    server.delete<{ Params: ScoreData }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = await request.params
            allScores = allScores.filter(score => score.id !== id)

            reply.send(`Score ${id} has been removed`)
        })
}

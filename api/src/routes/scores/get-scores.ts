import { FastifyInstance } from 'fastify'

import scores from '../../../scores'
import { ScoreData, AllScoresSchema } from '../../types/scores.types'


const schema = { response: { 200: AllScoresSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/scores',
        { schema },
        async (request, reply) => reply.send(scores)
    )
}

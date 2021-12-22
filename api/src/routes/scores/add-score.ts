import { FastifyInstance } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

import scores from '../../../scores'
import { ScoreSchema, ScoreData } from '../../types/scores.types'


const schema = { response: { 200: ScoreSchema } }
let allScores: ScoreData[] = scores

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: ScoreData, Reply: ScoreData }>(
        '/scores',
        { schema },
        async (request, reply) => {
            const { initials, score, game } = await request.body
            const scoreToAdd = {
                id: uuidv4(),
                initials,
                score,
                game
            }

            allScores = [...scores, scoreToAdd]

            reply.code(201).send(scoreToAdd)
        })
}

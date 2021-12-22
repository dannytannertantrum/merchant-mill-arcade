import { FastifyInstance } from 'fastify'

import scores from '../../../scores'
import { ScoreSchema, ScoreData } from '../../types/scores.types'


const schema = { response: { 200: ScoreSchema } }
let allScores: ScoreData[] = scores

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: ScoreData, Body: ScoreData, Reply: ScoreData }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            const { initials, score, game } = request.body

            const updatedAllScores = allScores.map(value => (value.id === id ? { id, initials, score, game } : value))

            const scoreToUpdate = updatedAllScores.find(value => value.id === id)

            reply.send(scoreToUpdate)
        })
}

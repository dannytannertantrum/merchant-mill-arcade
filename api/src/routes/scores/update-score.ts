import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { ScoreSchema, ScoreData } from '../../types/scores.types'
import { getScoreById } from '../common-queries'


const schema = { response: { 200: ScoreSchema } }

const upsertScore = async (
    pool: DatabasePoolType,
    scoreEntry: ScoreData
): Promise<void> => {
    await pool.query(sql<ScoreData>`
        UPDATE
            scores
        SET
            initials = ${scoreEntry.initials},
            score = ${scoreEntry.score}
        WHERE
            id = ${scoreEntry.id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: Pick<ScoreData, 'id'>, Body: Pick<ScoreData, 'game' | 'initials' | 'score'>, Reply: ScoreData }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            const { game, initials, score } = request.body
            if (!initials) throw new Error(`Initials are required`)
            if (!score) throw new Error(`Score is required`)

            try {
                const oldScore = await getScoreById(server.slonik.pool, id)

                const scoreToUpdate = {
                    ...oldScore,
                    game,
                    initials,
                    score
                }

                await upsertScore(server.slonik.pool, scoreToUpdate)

                reply.send(scoreToUpdate)
            } catch (err) {
                throw new Error(`Update score error: ${err}`)
            }

        })
}

export {
    upsertScore
}

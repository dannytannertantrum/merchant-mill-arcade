import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { ScoreSchema, ScoreData } from '../../types/scores.types'
import { getScoreById } from '../utilities/common-queries'


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
            console.log('FIRST', initials, score)
            // console log blank initials here - is it null or undefined?
            // check if throwing breaks all things
            // check if .catch lets us keep going?
            if (!initials) throw new Error(`Initials are required`)
            if (!score) throw new Error(`Score is required`)

            const oldScore = await getScoreById(server.slonik.pool, id)

            if (oldScore !== null) {
                const scoreToUpdate = {
                    ...oldScore,
                    game,
                    initials,
                    score
                }

                await upsertScore(server.slonik.pool, scoreToUpdate)

                reply.send(scoreToUpdate)
            } else {
                throw new Error('blah')
            }
        })
}

export {
    upsertScore
}

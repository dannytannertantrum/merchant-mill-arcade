import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { ReplyMessage } from '../../types/shared.types'

import { ScoreSchema, ScoreData } from '../../types/scores.types'


const schema = { response: { 200: ScoreSchema } }

const insertScore = async (
    pool: DatabasePoolType,
    { game, initials, score }: { game: string, initials: string, score: number }
): Promise<ScoreData> => {
    const result = await pool.query(sql<ScoreData>`
        INSERT INTO
            scores (game, initials, score)
        VALUES
            (${game}, ${initials}, ${score})
        RETURNING *;
    `)

    return result.rows[0]
}

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: Pick<ScoreData, 'game' | 'initials' | 'score'>, Reply: ReplyMessage<ScoreData> }>(
        '/scores',
        { schema },
        async (request, reply) => {
            const { game, initials, score } = request.body
            if (!initials) throw new Error('Initials are required')
            if (!score) throw new Error('Score is required')

            const scoreToAdd = {
                game,
                initials,
                score
            }

            let insertedScore: ScoreData

            try {
                insertedScore = await insertScore(server.slonik.pool, scoreToAdd)
            } catch (err) {
                throw new Error(`Add score error: ${err}`)
            }

            reply.code(201).send({
                data: insertedScore,
                message: `You just added a score of ${score} to the Merchant Mill Arcade for ${game}!`
            })
        })
}

export {
    insertScore
}

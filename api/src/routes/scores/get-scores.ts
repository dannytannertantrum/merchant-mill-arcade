import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleApiError, handleNotFoundError } from '../../custom-errors'
import { ScoreData, AllScoresSchema, AllScoresData } from '../../types/scores.types'


const schema = { response: { 200: AllScoresSchema } }

const getAllScores = async (pool: DatabasePoolType): Promise<Readonly<AllScoresData | []>> => {
    const result = await pool.query(sql<ScoreData>`
        SELECT * FROM scores;
    `)

    if (result.rows === []) return []
    return result.rows.map(score => {
        return {
            ...score,
            createdAt: new Date(score.createdAt).toISOString(),
            updatedAt: score.updatedAt && new Date(score.updatedAt).toISOString()
        }
    })
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{ Reply: Readonly<AllScoresData | Error> }>(
        '/scores',
        { schema },
        async (request, reply) => {

            const scores = await getAllScores(server.slonik.pool).catch(reason =>
                handleApiError(`ERROR GETTING SCORES: ${reason}`)
            )

            scores
                ? reply.send(scores)
                : reply.code(404).send(handleNotFoundError('ERROR OnSend /GET scores: Scores not found.'))

        }
    )
}

export {
    getAllScores
}

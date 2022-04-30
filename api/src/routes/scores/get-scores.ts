import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleApiError, handleNotFoundError } from '../../customErrors'
import { ScoreData, AllScoresSchema, AllScoresData } from '../../types/scores.types'


const schema = { response: { 200: AllScoresSchema } }

const getAllScores = async (pool: DatabasePoolType): Promise<Readonly<AllScoresData | []>> => {
    const result = await pool.query(sql<ScoreData>`
        SELECT * FROM scores;
    `)

    return result.rows
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

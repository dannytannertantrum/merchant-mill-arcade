import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleApiError, handleNotFoundError } from '../../custom-errors'
import { ScoreData, AllScoresSchema, AllScoresData } from '../../types/scores.types'


const schema = { response: { 200: AllScoresSchema } }

const getAllScores = async (pool: DatabasePoolType): Promise<Readonly<AllScoresData | []>> => {
    const result = await pool.query(sql<ScoreData>`
        SELECT * FROM scores;
    `)

    return result.rows
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/scores',
        { schema },
        async (_request, reply) => {

            const scores = await getAllScores(server.slonik.pool).catch(reason =>
                handleApiError(`ERROR GETTING SCORES: ${reason}`)
            )

            reply.send(JSON.stringify(scores))
        }
    )
}

export {
    getAllScores
}

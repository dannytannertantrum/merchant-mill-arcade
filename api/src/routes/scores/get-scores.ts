import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { ScoreData, AllScoresSchema, AllScoresData } from '../../types/scores.types'


const schema = { response: { 200: AllScoresSchema } }

const getAllScores = async (pool: DatabasePoolType): Promise<Readonly<AllScoresData>> => {
    const result = await pool.query(sql<ScoreData>`
        SELECT * FROM scores;
    `)

    return result.rows
}

export default async (server: FastifyInstance): Promise<void> => {
    server.get<{Reply: Readonly<AllScoresData>}>(
        '/scores',
        { schema },
        async (request, reply) => {
            try {
                const scores = await getAllScores(server.slonik.pool)
                reply.send(scores)
            } catch (err) {
                throw new Error(`Get scores error: ${err}`)
            }
        }
    )
}

export {
    getAllScores
}

import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleError, handleNotFoundError } from '../../utilities/custom-errors'
import { AllScoresData, AllScoresSchema, ScoreData } from '../../common/scores.types'
import { GameData } from '../../common/games.types'


const schema = { response: { 200: AllScoresSchema } }

const getScoresByGameId = async (pool: DatabasePoolType, gameId: string): Promise<AllScoresData | []> => {
    const result = await pool.query(sql<ScoreData>`
        SELECT
            s.id,
            s.game_id,
            s.is_deleted,
            s.initials,
            s.score,
            s.created_at,
            s.updated_at
        FROM scores s
        JOIN games g ON s.game_id = g.id
        WHERE
            s.game_id = ${gameId} AND
            s.is_deleted = FALSE
        ORDER BY s.score DESC
        LIMIT 5;
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
    server.get<{ Params: Pick<GameData, 'id'>, Reply: AllScoresData | Error }>(
        '/scores-by-game/:id',
        { schema },
        async (request, reply) => {
            try {

                const { id } = request.params

                const scores = await getScoresByGameId(server.slonik.pool, id)

                scores
                    ? reply.send(scores)
                    : handleNotFoundError('OnSend /GET scores-by-game: Scores not found.')

            } catch (reason) {
                handleError('ERROR GETTING SCORES BY ID: ', reason, reply)
            }
        }
    )
}

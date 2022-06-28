import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { handleError, handleValidationError } from '../../utilities/custom-errors'
import { ScoreData, ScoreRequestBodyWithGame, ScoreSchema } from '../../common/scores.types'
import { sanitizeScore } from '../../utilities/number-helpers'
import { textInputCleanUpWhitespace } from '../../utilities/string-helpers'


const schema = { response: { 200: ScoreSchema } }

const insertScore = async (
    pool: DatabasePoolType,
    { id, gameId, initials, isDeleted, score, createdAt }: Omit<ScoreData, 'updatedAt'>
): Promise<void> => {
    await pool.query(sql<ScoreData>`
        INSERT INTO
            scores (id, game_id, initials, is_deleted, score, created_at)
        VALUES
            (${id}, ${gameId}, ${initials}, ${isDeleted}, ${score}, ${createdAt}::timestamptz);
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: ScoreRequestBodyWithGame, Reply: Omit<ScoreData, 'updatedAt'> }>(
        '/scores',
        { schema },
        async (request, reply) => {
            try {

                const { gameId } = request.body
                const id = request.body.id || uuidv4()
                let { initials, score } = request.body

                let scrubbedInitials = textInputCleanUpWhitespace(initials)
                score = sanitizeScore(score)

                if (scrubbedInitials === undefined || scrubbedInitials === '' || score === undefined) {
                    handleValidationError('Please enter 1-3 letters for initials and/or a score above 0!')
                } else {
                    const isDeleted = false
                    const createdAt = new Date().toISOString()

                    const scoreToAdd = {
                        id,
                        initials: scrubbedInitials,
                        isDeleted,
                        score,
                        gameId,
                        createdAt
                    }

                    await insertScore(server.slonik.pool, scoreToAdd)

                    reply.code(201).send(scoreToAdd)
                }

            } catch (reason) {
                handleError('ERROR ADDING SCORE: ', reason, reply)
            }
        }
    )
}

export {
    insertScore
}

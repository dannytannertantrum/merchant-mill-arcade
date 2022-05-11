import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { handleApiError, handleValidationError } from '../../utilities/custom-errors'
import { ScoreData, ScoreRequestBodyWithGame, ScoreSchema } from '../types/scores.types'
import { sanitizeScore } from '../../utilities/number-helpers'
import { textInputCleanUpWhitespace } from '../../utilities/string-helpers'


const schema = { response: { 200: ScoreSchema } }

const insertScore = async (
    pool: DatabasePoolType,
    { id, game, initials, isDeleted, score, createdAt }: Omit<ScoreData, 'updatedAt'>
): Promise<void> => {
    await pool.query(sql<ScoreData>`
        INSERT INTO
            scores (id, game, initials, is_deleted, score, created_at)
        VALUES
            (${id}, ${game}, ${initials}, ${isDeleted}, ${score}, ${createdAt}::timestamptz);
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: ScoreRequestBodyWithGame, Reply: Omit<ScoreData, 'updatedAt'> }>(
        '/scores',
        { schema },
        async (request, reply) => {
            const { game } = request.body
            const id = request.body.id || uuidv4()
            let { initials, score } = request.body

            let scrubbedInitials = textInputCleanUpWhitespace(initials)
            score = sanitizeScore(score)

            if (scrubbedInitials === undefined || scrubbedInitials === '' || score === undefined) {
                handleValidationError('VALIDATION ERROR ADDING SCORE: Please enter 1-3 letters for initials and/or a score above 0!')
            } else {
                const isDeleted = false
                const createdAt = new Date().toISOString()

                const scoreToAdd = {
                    id,
                    initials: scrubbedInitials,
                    isDeleted,
                    score,
                    game,
                    createdAt
                }

                await insertScore(server.slonik.pool, scoreToAdd).catch(reason =>
                    handleApiError(`API ERROR ADDING SCORE: ${reason}`)
                )

                reply.code(201).send(scoreToAdd)
            }
        })
}

export {
    insertScore
}

import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleError, handleNotFoundError, handleValidationError } from '../../utilities/custom-errors'
import { ScoreSchema, ScoreData, ScoreRequestBody } from '../../common/scores.types'
import { getScoreById } from '../common-queries'
import { textInputCleanUpWhitespace } from '../../utilities/string-helpers'
import { sanitizeScore } from '../../utilities/number-helpers'


const schema = { response: { 200: ScoreSchema } }

const upsertScore = async (
    pool: DatabasePoolType,
    scoreEntry: ScoreData
): Promise<void> => {
    await pool.query(sql<ScoreData>`
        UPDATE
            scores
        SET
            is_deleted = ${scoreEntry.isDeleted},
            initials = ${scoreEntry.initials},
            score = ${scoreEntry.score},
            updated_at = ${scoreEntry.updatedAt}
        WHERE
            id = ${scoreEntry.id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: Pick<ScoreData, 'id'>, Body: ScoreRequestBody, Reply: ScoreData | Error }>(
        '/scores/:id',
        { schema },
        async (request, reply) => {
            try {
                const { id } = request.params
                let { initials, score } = request.body
                let updatedAt: string | null

                let scrubbedInitials = textInputCleanUpWhitespace(initials)
                let sanitizedScore = sanitizeScore(score)

                if (scrubbedInitials === undefined || scrubbedInitials === '' || sanitizedScore === undefined) {
                    handleValidationError('Please enter 1-3 letters for initials and/or a score above 0!')
                } else {
                    const oldScore = await getScoreById(server.slonik.pool, id)

                    // We don't want to change updatedAt if the user essentially goes to edit
                    // But then saves a score with the same exact values as before
                    if (
                        scrubbedInitials.toLowerCase() === oldScore?.initials.toLowerCase()
                        && sanitizedScore === Number(oldScore?.score)
                        && oldScore?.updatedAt != null
                    ) {
                        updatedAt = new Date(oldScore?.updatedAt).toISOString()
                    } else {
                        updatedAt = new Date().toISOString()
                    }

                    if (oldScore !== null) {
                        const scoreToUpdate = {
                            ...oldScore,
                            initials: scrubbedInitials,
                            score: sanitizedScore,
                            updatedAt
                        }

                        await upsertScore(server.slonik.pool, scoreToUpdate)

                        reply.send(scoreToUpdate)
                    } else {
                        handleNotFoundError('OnSend /PUT score: Score not found.')
                    }
                }

            } catch (reason) {
                handleError('ERROR UPDATING SCORE: ', reason, reply)
            }
        }
    )
}

export {
    upsertScore
}

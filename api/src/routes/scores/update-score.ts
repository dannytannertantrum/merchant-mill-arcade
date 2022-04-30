import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { handleApiError, handleNotFoundError, handleValidationError } from '../../customErrors'
import { ScoreSchema, ScoreData, ScoreRequestBody } from '../../types/scores.types'
import { getScoreById } from '../utilities/common-queries'
import { textInputCleanUp } from '../utilities/stringHelpers'
import { sanitizeScore } from '../utilities/numberHelpers'


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
            const { id } = request.params
            let { initials, score } = request.body
            let updatedAt: string | null

            initials = textInputCleanUp(initials)
            score = sanitizeScore(score)

            if (initials === '' || initials === undefined || score === undefined) {
                handleValidationError('Please enter 1-3 letters for initials and/or a score above 0!')
            } else {
                const oldScore = await getScoreById(server.slonik.pool, id)

                // We don't want to change updatedAt if the user essentially goes to edit
                // But then saves a score with the same exact values as before
                if (
                    initials.toLowerCase() === oldScore?.initials.toLowerCase()
                    && score === Number(oldScore?.score)
                    && oldScore?.updatedAt != null
                ) {
                    updatedAt = new Date(oldScore?.updatedAt).toISOString()
                } else {
                    updatedAt = new Date().toISOString()
                }

                if (oldScore !== null) {
                    const scoreToUpdate = {
                        ...oldScore,
                        initials,
                        score,
                        updatedAt
                    }

                    await upsertScore(server.slonik.pool, scoreToUpdate).catch(reason =>
                        handleApiError(`ERROR UPDATING SCORE: ${reason}`)
                    )

                    reply.send(scoreToUpdate)
                } else {
                    reply.code(404).send(handleNotFoundError('ERROR OnSend /PUT score: Score not found.'))
                }
            }
        }
    )
}

export {
    upsertScore
}

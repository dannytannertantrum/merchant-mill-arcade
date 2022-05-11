import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { GameData, GameRequestBody, GameSchema } from '../types/games.types'
import { queryForActiveGame } from '../common-queries'
import { constructSlug, textInputCleanUpWhitespace } from '../../utilities/string-helpers'
import { handleApiError, handleValidationError, handleDuplicateEntryError } from '../../utilities/custom-errors'


const schema = { response: { 200: GameSchema } }

const insertGame = async (
    pool: DatabasePoolType,
    { id, description, imageUrl, isDeleted, slug, title, createdAt }: Omit<GameData, 'updatedAt'>
): Promise<void> => {
    await pool.query(sql<GameData>`
        INSERT INTO
            games (id, description, image_url, is_deleted, slug, title, created_at)
        VALUES
            (${id}, ${description}, ${imageUrl}, ${isDeleted}, ${slug}, ${title}, ${createdAt}::timestamptz);
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: GameRequestBody, Reply: Omit<GameData, 'updatedAt'> }>(
        '/games',
        { schema },
        async (request, reply) => {
            let { description, imageUrl, title } = request.body
            const id = request.body.id || uuidv4()

            let [
                scrubbedDescription,
                scrubbedImageUrl,
                scrubbedTitle
            ] = [description, imageUrl, title].map(val => textInputCleanUpWhitespace(val))

            if (scrubbedTitle === undefined || scrubbedTitle === '') {
                handleValidationError('VALIDATION ERROR ADDING GAME: Title is required for adding a game!')
            } else {
                const ActiveGameCheck = await queryForActiveGame({
                    pool: server.slonik.pool, title: scrubbedTitle, id
                }).catch(reason =>
                    handleApiError(`API ERROR CHECKING FOR DUPLICATE GAME: ${reason}`)
                )

                if (ActiveGameCheck?.isActive) {
                    handleDuplicateEntryError('CONFLICT ERROR: That game already exists in the Merchant Mill Arcade!')
                }

                const isDeleted = false
                const slug = constructSlug(scrubbedTitle)
                const createdAt = new Date().toISOString()

                const gameToAdd = {
                    id,
                    description: scrubbedDescription === undefined ? null : scrubbedDescription,
                    imageUrl: scrubbedImageUrl === undefined ? null : scrubbedImageUrl,
                    isDeleted,
                    slug,
                    title: scrubbedTitle,
                    createdAt
                }

                await insertGame(server.slonik.pool, gameToAdd).catch(reason =>
                    handleApiError(`API ERROR ADDING GAME: ${reason}`)
                )

                reply.code(201).send(gameToAdd)
            }
        }
    )
}

export {
    insertGame
}

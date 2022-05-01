import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { GameData, GameRequestBody, GameSchema } from '../../types/games.types'
import { queryForDuplicateGame } from '../utilities/common-queries'
import { constructSlug, textInputCleanUpWhitespace } from '../utilities/stringHelpers'
import { handleApiError, handleValidationError, handleDuplicateEntryError } from '../../customErrors'


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

            if (scrubbedTitle === '' || scrubbedTitle === undefined) {
                handleValidationError('Title is required!')
            } else {
                const duplicateGameCheck = await queryForDuplicateGame({
                    pool: server.slonik.pool, title: scrubbedTitle, id, isPutRequest: false
                }).catch(reason =>
                    handleApiError(`ERROR CHECKING FOR DUPLICATE GAME: ${reason}`)
                )

                if (duplicateGameCheck?.isDuplicate) handleDuplicateEntryError('CONFLICT ERROR: That game already exists in the Merchant Mill Arcade!')

                const isDeleted = false
                const slug = constructSlug(scrubbedTitle)
                const createdAt = new Date().toISOString()

                const gameToAdd = {
                    id,
                    description: scrubbedDescription || null,
                    imageUrl: scrubbedImageUrl || null,
                    isDeleted,
                    slug,
                    title: scrubbedTitle,
                    createdAt
                }

                await insertGame(server.slonik.pool, gameToAdd).catch(reason =>
                    handleApiError(`ERROR ADDING GAME: ${reason}`)
                )

                reply.code(201).send(gameToAdd)
            }
        }
    )
}

export {
    insertGame,
    queryForDuplicateGame
}

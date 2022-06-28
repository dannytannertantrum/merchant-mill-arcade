import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { GameData, GameRequestBody, GameSchema } from '../../common/games.types'
import { queryForActiveGame } from '../common-queries'
import { constructSlug, textInputCleanUpWhitespace } from '../../utilities/string-helpers'
import { handleValidationError, handleDuplicateEntryError, handleError } from '../../utilities/custom-errors'


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
            try {

                let { description, imageUrl, title } = request.body
                const id = request.body.id || uuidv4()

                let [
                    scrubbedDescription,
                    scrubbedImageUrl,
                    scrubbedTitle
                ] = [description, imageUrl, title].map(val => textInputCleanUpWhitespace(val))

                if (scrubbedTitle === undefined || scrubbedTitle === '') {
                    handleValidationError('Title is required for adding a game!')
                } else {
                    const ActiveGameCheck = await queryForActiveGame({ pool: server.slonik.pool, title: scrubbedTitle, id })

                    if (ActiveGameCheck?.isActive) {
                        handleDuplicateEntryError('That game already exists in the Merchant Mill Arcade!')
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

                    await insertGame(server.slonik.pool, gameToAdd)

                    reply.code(201).send(gameToAdd)
                }

            } catch (reason) {
                handleError('ERROR ADDING GAME: ', reason, reply)
            }
        }
    )
}

export {
    insertGame
}

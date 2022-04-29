import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { GameData, GameSchema } from '../../types/games.types'
import { queryForDuplicateGame } from '../common-queries'
import { constructSlug, textInputCleanUp } from '../utilities'
import { handleApiError, handleValidationError, handleDuplicateEntryError } from '../../customErrors'


const schema = { response: { 200: GameSchema } }

const insertGame = async (
    pool: DatabasePoolType,
    { id, description, isDeleted, slug, title, createdAt }: { id: string, description: string, isDeleted: boolean, slug: string, title: string, createdAt: string }
): Promise<void> => {
    await pool.query(sql<GameData>`
        INSERT INTO
            games (id, description, is_deleted, slug, title, created_at)
        VALUES
            (${id}, ${description}, ${isDeleted}, ${slug}, ${title}, ${createdAt}::timestamptz);
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: Omit<GameData, 'updatedAt'>, Reply: Omit<GameData, 'updatedAt'> }>(
        '/games',
        { schema },
        async (request, reply) => {
            const { description } = request.body
            const id = request.body.id || uuidv4()
            let { title } = request.body

            if (title !== undefined) title = textInputCleanUp(title)
            if (title === '' || title === undefined) handleValidationError('Title is required!')

            const duplicateGameCheck = await queryForDuplicateGame({ pool: server.slonik.pool, title, id, isPutRequest: false }).catch(reason =>
                handleApiError(`ERROR CHECKING FOR DUPLICATE GAME: ${reason}`)
            )

            if (duplicateGameCheck?.isDuplicate) handleDuplicateEntryError('CONFLICT ERROR: That game already exists in the Merchant Mill Arcade!')

            const isDeleted = false
            const slug = constructSlug(title)
            const createdAt = new Date().toISOString()

            const gameToAdd = {
                id,
                description: description || '',
                isDeleted,
                slug,
                title,
                createdAt
            }

            await insertGame(server.slonik.pool, gameToAdd).catch(reason => {
                handleApiError(`ERROR ADDING GAME: ${reason}`)
            })

            reply.code(201).send(gameToAdd)
        }
    )
}

export {
    insertGame,
    queryForDuplicateGame
}

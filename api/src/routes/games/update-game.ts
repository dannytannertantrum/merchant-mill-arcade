import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { GameData, GameSchema } from '../../types/games.types'
import { DuplicateGameReturnValue, queryForDuplicateGame } from '../utilities/common-queries'
import { constructSlug, textInputCleanUp } from '../utilities/stringHelpers'
import { handleApiError, handleValidationError, handleDuplicateEntryError, handleNotFoundError } from '../../customErrors'


const schema = { response: { 200: GameSchema } }

interface queryNoChanges {
    canBypass: boolean
    game: GameData
}

const queryForNoChanges = async (
    pool: DatabasePoolType,
    id: string,
    title: string
): Promise<queryNoChanges | null> => {
    title = title.toLowerCase()

    const result = await pool.maybeOne(sql<GameData>`
        SELECT *
        FROM games
        WHERE LOWER(title) = ${title} AND id = ${id} AND is_deleted = FALSE;
    `)

    return result
        ? {
            canBypass: result?.title.toLowerCase() === title,
            game: result
        } : null
}

const upsertGame = async (
    pool: DatabasePoolType,
    game: GameData
): Promise<void> => {
    await pool.query(sql<GameData>`
        UPDATE
            games
        SET 
            description = ${game.description},
            is_deleted = ${game.isDeleted},
            slug = ${game.slug},
            title = ${game.title},
            updated_at = ${game.updatedAt}::timestamptz
        WHERE id = ${game.id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: GameData, Body: GameData, Reply: GameData | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            let { description, title } = request.body
            let duplicateGameCheck: DuplicateGameReturnValue
            let game: GameData | null = null
            let updatedAt: string | null

            if (description !== undefined) description = textInputCleanUp(description)
            if (title !== undefined) title = textInputCleanUp(title)
            if (title === '' || title === undefined) handleValidationError('Title is required!')

            const editedGameExists = await queryForNoChanges(server.slonik.pool, id, title)

            // If a user goes to edit, but keeps the title exactly the same
            // We'll know it's not a duplicate and can by bypass our dupe check
            if (editedGameExists?.canBypass) {
                game = editedGameExists.game
            } else {
                duplicateGameCheck = await queryForDuplicateGame({ pool: server.slonik.pool, title, id, isPutRequest: true }).catch(reason =>
                    handleApiError(`ERROR CHECKING FOR DUPLICATE GAME: ${reason}`)
                )

                if (duplicateGameCheck?.isDuplicate) {
                    handleDuplicateEntryError('CONFLICT ERROR: That game already exists in the Merchant Mill Arcade!')
                }

                game = duplicateGameCheck.game
            }

            const isDeleted = false
            const slug = constructSlug(title)

            // We don't want to change updatedAt if the user essentially goes to edit
            // But then saves a game with the except same values as before
            if (
                game?.title.toLowerCase() === title.toLowerCase()
                && game?.description.toLowerCase() === description?.toLowerCase()
            ) {
                updatedAt = new Date(game?.updatedAt).toISOString()
            } else {
                updatedAt = new Date().toISOString()
            }

            if (game) {
                const gameToUpdate = {
                    ...game,
                    isDeleted,
                    title,
                    description: description || game.description,
                    slug,
                    updatedAt
                }

                await upsertGame(server.slonik.pool, gameToUpdate).catch(reason =>
                    handleApiError(`ERROR UPDATING GAME: ${reason}`)
                )

                reply.send(gameToUpdate)
            } else {
                reply.code(404).send(handleNotFoundError(`ERROR OnSend /PUT game: Game not found.`))
            }
        }
    )
}

export {
    upsertGame
}

import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { GameData, GameRequestBody, GameSchema } from '../../common/games.types'
import { ActiveGameReturnValue, queryForActiveGame } from '../common-queries'
import { constructSlug, textInputCleanUpWhitespace } from '../../utilities/string-helpers'
import { handleValidationError, handleDuplicateEntryError, handleNotFoundError, handleError } from '../../utilities/custom-errors'


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
        WHERE LOWER(title) = ${title}
            AND id = ${id}
            AND is_deleted = FALSE;
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
            image_url = ${game.imageUrl},
            is_deleted = ${game.isDeleted},
            slug = ${game.slug},
            title = ${game.title},
            updated_at = ${game.updatedAt}::timestamptz
        WHERE id = ${game.id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: Pick<GameData, 'id'>, Body: GameRequestBody, Reply: GameData | Error }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            try {
                const { id } = request.params
                let { description, imageUrl, title } = request.body
                let ActiveGameCheck: ActiveGameReturnValue
                let game: GameData | null = null
                let updatedAt: string | null

                let [
                    scrubbedDescription,
                    scrubbedImageUrl,
                    scrubbedTitle
                ] = [description, imageUrl, title].map(val => textInputCleanUpWhitespace(val))

                if (scrubbedTitle === undefined || scrubbedTitle === '') {
                    handleValidationError('Title is required for updating a game!')
                } else {
                    const editedGameExists = await queryForNoChanges(server.slonik.pool, id, scrubbedTitle)

                    // If a user goes to edit, but keeps the title exactly the same
                    // We'll know it's not a duplicate and can by bypass our dupe check
                    if (editedGameExists?.canBypass) {
                        game = editedGameExists.game
                    } else {
                        ActiveGameCheck = await queryForActiveGame({ pool: server.slonik.pool, title: scrubbedTitle, id })

                        if (ActiveGameCheck?.isActive) {
                            handleDuplicateEntryError('That game already exists in the Merchant Mill Arcade!')
                        }

                        game = ActiveGameCheck.game
                    }

                    const isDeleted = false
                    const slug = constructSlug(scrubbedTitle)

                    // We don't want to change updatedAt if the user essentially goes to edit
                    // But then saves a game with the same exact values as before
                    if (
                        game?.title.toLowerCase() === scrubbedTitle.toLowerCase()
                        && (game?.description?.toLowerCase() === scrubbedDescription?.toLowerCase() || scrubbedDescription === undefined)
                        && (game?.imageUrl?.toLowerCase() === scrubbedImageUrl?.toLowerCase() || scrubbedImageUrl === undefined)
                        && game?.updatedAt != null
                    ) {
                        updatedAt = new Date(game?.updatedAt).toISOString()
                    } else {
                        updatedAt = new Date().toISOString()
                    }

                    if (game) {
                        const gameToUpdate = {
                            ...game,
                            description: scrubbedDescription === '' ? null : scrubbedDescription || game.description,
                            imageUrl: scrubbedImageUrl === undefined ? null : scrubbedImageUrl || game.imageUrl,
                            isDeleted,
                            title: scrubbedTitle,
                            slug,
                            updatedAt
                        }

                        await upsertGame(server.slonik.pool, gameToUpdate)

                        reply.send(gameToUpdate)
                    } else {
                        handleNotFoundError(`OnSend /PUT game: Game not found.`)
                    }
                }

            } catch (reason) {
                handleError('ERROR UPDATING GAME: ', reason, reply)
            }
        }
    )
}

export {
    upsertGame
}

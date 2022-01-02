import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'

import { GameData, GameSchema } from '../../types/games.types'
import { getGameById, queryForDuplicateGame } from '../common-queries'
import { constructSlug } from '../utilities'


const schema = { response: { 200: GameSchema } }

const upsertGame = async (
    pool: DatabasePoolType,
    game: GameData
): Promise<void> => {
    await pool.query(sql<GameData>`
        UPDATE
            games
        SET 
            description = ${game.description},
            slug = ${game.slug},
            title = ${game.title},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${game.id};
    `)
}

export default async (server: FastifyInstance): Promise<void> => {
    server.put<{ Params: GameData, Body: GameData, Reply: GameData }>(
        '/games/:id',
        { schema },
        async (request, reply) => {
            const { id } = request.params
            const { title, description } = request.body
            if (!title) throw new Error('Title is required')

            const isDuplicateGame = await queryForDuplicateGame({ pool: server.slonik.pool, title, id })
            if (isDuplicateGame) throw new Error(`${title} already exists in the Merchant Mill Arcade!`)

            const slug = constructSlug(title)

            try {
                const game = await getGameById(server.slonik.pool, id)

                const gameToUpdate = {
                    ...game,
                    title,
                    description: description || '',
                    slug
                }

                await upsertGame(server.slonik.pool, gameToUpdate)

                reply.send(gameToUpdate)
            } catch (err) {
                throw new Error(`Update game error: ${err}`)
            }
        }
    )
}

export {
    upsertGame
}

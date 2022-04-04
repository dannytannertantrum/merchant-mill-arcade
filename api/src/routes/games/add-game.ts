import { FastifyInstance } from 'fastify'
import { DatabasePoolType, QueryResultType, sql } from 'slonik'

import { GameData, GameSchema } from '../../types/games.types'
import { ReplyMessage } from '../../types/shared.types'
import { queryForDuplicateGame } from '../common-queries'
import { constructSlug } from '../utilities'


const schema = { response: { 200: GameSchema } }

const insertGame = async (
    pool: DatabasePoolType,
    { description, slug, title }: { description: string, slug: string, title: string }
): Promise<GameData> => {
    const result = await pool.query(sql<GameData>`
        INSERT INTO
            games (description, title, slug)
        VALUES
            (${description}, ${title}, ${slug})
        RETURNING *;
    `)

    return result.rows[0]
}

export default async (server: FastifyInstance): Promise<void> => {
    server.post<{ Body: Pick<GameData, 'title' | 'description'>, Reply: ReplyMessage<GameData> }>(
        '/games',
        { schema },
        async (request, reply) => {
            const { title, description } = request.body
            if (!title) throw new Error('Title is required')

            const isDuplicateGame = await queryForDuplicateGame({ pool: server.slonik.pool, title })
            if (isDuplicateGame) throw new Error(`${title} already exists in the Merchant Mill Arcade!`)

            const slug = constructSlug(title)
            const gameToAdd = {
                description: description || '',
                slug,
                title
            }

            let insertedGame: GameData

            try {
                insertedGame = await insertGame(server.slonik.pool, gameToAdd)
            } catch (err) {
                throw new Error(`Add game error: ${err}`)
            }

            reply.code(201).send({
                body: insertedGame,
                message: `You just added ${title} to the Merchant Mill Arcade!`
            })
        }
    )
}

export {
    insertGame,
    queryForDuplicateGame
}

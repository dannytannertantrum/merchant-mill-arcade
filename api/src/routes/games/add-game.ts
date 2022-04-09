import { FastifyInstance } from 'fastify'
import { DatabasePoolType, sql } from 'slonik'
import { v4 as uuidv4 } from 'uuid'

import { GameData, GameSchema } from '../../types/games.types'
import { ReplyMessage } from '../../types/shared.types'
import { queryForDuplicateGame } from '../common-queries'
import { constructSlug } from '../utilities'


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
    server.post<{ Body: Omit<GameData, 'updatedAt'>, Reply: ReplyMessage<Omit<GameData, 'updatedAt'>> }>(
        '/games',
        { schema },
        async (request, reply) => {
            const { title, description } = request.body
            if (!title) throw new Error('Title is required')

            const isDuplicateGame = await queryForDuplicateGame({ pool: server.slonik.pool, title })
            if (isDuplicateGame) throw new Error(`${title} already exists in the Merchant Mill Arcade!`)

            const id = uuidv4()
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

            try {
                await insertGame(server.slonik.pool, gameToAdd)
            } catch (err) {
                throw new Error(`Add game error: ${err}`)
            }

            reply.code(201).send({
                data: gameToAdd,
                message: `You just added ${title} to the Merchant Mill Arcade!`
            })
        }
    )
}

export {
    insertGame,
    queryForDuplicateGame
}

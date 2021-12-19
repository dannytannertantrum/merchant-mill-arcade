import { getGame, getGames } from "../controllers/games.controller.js"

// Game schema
const Game = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' }
    }
}

const getGamesOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: Game
            }
        }
    },
    handler: getGames
}

const getGameOptions = {
    schema: {
        response: {
            200: Game
        }
    },
    handler: getGame
}

const gameRoutes = (fastify, options, done) => {
    fastify.get('/games', getGamesOptions)
    fastify.get('/games/:id', getGameOptions)

    done()
}

export default gameRoutes

import {
    deleteGameOptions,
    getGameOptions,
    getGamesOptions,
    postGameOptions,
    updateGameOptions
} from './options/games.options.js'

const gameRoutes = (fastify, options, done) => {
    fastify.get('/games', getGamesOptions)
    fastify.get('/games/:id', getGameOptions)
    fastify.post('/games', postGameOptions)
    fastify.delete('/games/:id', deleteGameOptions)
    fastify.put('/games/:id', updateGameOptions)

    done()
}

export default gameRoutes

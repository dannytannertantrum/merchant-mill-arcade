import {
    deleteScoreOptions,
    getScoreOptions,
    getScoresOptions,
    postScoreOptions,
    updateScoreOptions
} from './options/scores.options.js'

const scoreRoutes = (fastify, options, done) => {
    fastify.get('/scores', getScoresOptions)
    fastify.get('/scores/:id', getScoreOptions)
    fastify.post('/scores', postScoreOptions)
    fastify.delete('/scores/:id', deleteScoreOptions)
    fastify.put('/scores/:id', updateScoreOptions)

    done()
}

export default scoreRoutes

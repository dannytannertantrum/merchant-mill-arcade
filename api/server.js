import Fastify from 'fastify'

import gameRoutes from './routes/games.route.js'

const fastify = Fastify({ logger: true })

fastify.register(gameRoutes)

const PORT = 7000
const start = async () => {
    try {
        await fastify.listen(PORT)
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()

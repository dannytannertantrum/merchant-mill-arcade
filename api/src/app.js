import Fastify from 'fastify'
import fastifySwagger from 'fastify-swagger'

import gameRoutes from './routes/games.routes.js'
import scoreRoutes from './routes/scores.routes.js'


const fastify = Fastify({ logger: true })

fastify.register(fastifySwagger, {
    exposeRoute: true, // enable documentation route
    routePrefix: '/docs',
    swagger: {
        info: { title: 'fastify-api routes' }
    }
})
fastify.register(gameRoutes)
fastify.register(scoreRoutes)

export default fastify

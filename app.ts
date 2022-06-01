import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifySwagger from 'fastify-swagger'
import fastifyCors from '@fastify/cors'
import { DatabasePoolType } from 'slonik'
import 'dotenv/config'

import dbConnector from './database/db-connector'
import addGame from './routes/games/add-game'
import addScore from './routes/scores/add-score'
import getGame from './routes/games/get-game'
import getScore from './routes/scores/get-score'
import getGames from './routes/games/get-games'
import deleteGame from './routes/games/delete-game'
import deleteScore from './routes/scores/delete-score'
import updateGame from './routes/games/update-game'
import updateScore from './routes/scores/update-score'


interface FastifySlonik {
    pool: DatabasePoolType
}

declare module 'fastify' {
    interface FastifyInstance {
        slonik: FastifySlonik
    }
}

const server = fastify<Server, IncomingMessage, ServerResponse>({
    logger: process.env.NODE_ENV === 'TEST' ? false : true,
    disableRequestLogging: true // replace the standard output with our own custom logging below with hooks
})

server.register(fastifyCors, {
    origin: process.env.NODE_ENV === 'development'
        ? 'http://localhost:1234'
        : 'https://merchantmillarcade.com'
})

server.addHook('onRequest', (req, _reply, done) => {
    req.log.info({
        method: req.method,
        url: req.raw.url,
        requestBody: req.body
    }, 'RECEIVED REQUEST')

    done()
}).addHook('onResponse', (req, reply, done) => {
    req.log.info({ url: req.raw.url }, `REQUEST COMPLETED ${reply.raw.statusCode}`)
    done()
})

server.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'fastify-api routes',
            version: '4.13.0'
        },
    }
})
server.register(dbConnector)

server.register(addGame)
server.register(addScore)
server.register(getGame)
server.register(getScore)
server.register(getGames)
server.register(deleteGame)
server.register(deleteScore)
server.register(updateGame)
server.register(updateScore)

export default server

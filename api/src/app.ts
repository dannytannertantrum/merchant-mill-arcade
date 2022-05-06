import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifySwagger from 'fastify-swagger'
import { DatabasePoolType } from 'slonik'
import 'dotenv/config'

import dbConnector from './db-connector'
import addGame from './routes/games/add-game'
import addScore from './routes/scores/add-score'
import getGame from './routes/games/get-game'
import getScore from './routes/scores/get-score'
import getGames from './routes/games/get-games'
import getScores from './routes/scores/get-scores'
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

server.addHook('onRequest', (request, _reply, done) => {
    request.log.info({
        method: request.method,
        url: request.raw.url,
        requestBody: request.body
    }, 'RECEIVED REQUEST')

    done()
}).addHook('onResponse', (request, reply, done) => {
    request.log.info({ url: request.raw.url }, `REQUEST COMPLETED ${reply.raw.statusCode}`)
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
server.register(getScores)
server.register(deleteGame)
server.register(deleteScore)
server.register(updateGame)
server.register(updateScore)

export default server

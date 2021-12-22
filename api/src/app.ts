import fastify from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifySwagger from 'fastify-swagger'

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


const server = fastify<Server, IncomingMessage, ServerResponse>({ logger: true })

server.register(fastifySwagger, {
    exposeRoute: true, // enable documentation route
    routePrefix: '/docs',
    swagger: {
        info: {
            title: 'fastify-api routes',
            version: '4.13.0'
        },
    }
})
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

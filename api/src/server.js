import fastify from './app.js'

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

import Fastify from 'fastify'
const app = Fastify({
    logger: true
})
const PORT = 7000

app.get('/', (req, res) => {
    res.send({ test: 'Hello ' })
})

const start = async () => {
    try {
        await app.listen(PORT)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()

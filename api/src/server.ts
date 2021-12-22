import server from './app'

const PORT = 7000
const start = async () => {
    try {
        await server.listen(PORT)
    } catch (error) {
        server.log.error(error)
        process.exit(1)
    }
}

start()

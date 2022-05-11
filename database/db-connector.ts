import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { createPool } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'


const CONNECTION_STRING = process.env.NODE_ENV === 'TEST'
    ? process.env.TEST_POSTGRES_CONNECTION_STRING
    : process.env.POSTGRES_CONNECTION_STRING

const interceptors = [
    createFieldNameTransformationInterceptor({
        format: 'CAMEL_CASE'
    })
]
const initializeDatabase = async (server: FastifyInstance) => {
    const pool = createPool(`${CONNECTION_STRING}`, {
        interceptors
    })

    server.decorate('slonik', { pool })
    server.addHook('onClose', async () => {
        await pool.end()
    })
}

export default fastifyPlugin(initializeDatabase)

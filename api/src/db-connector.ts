import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { createPool } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'


const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = process.env
const interceptors = [
    createFieldNameTransformationInterceptor({
        format: 'CAMEL_CASE'
    })
]
const initializeDatabase = async (server: FastifyInstance) => {
    const pool = createPool(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}}`, {
        interceptors
    })

    server.decorate('slonik', { pool })
    server.addHook('onClose', async () => {
        await pool.end()
    })
}

export default fastifyPlugin(initializeDatabase)

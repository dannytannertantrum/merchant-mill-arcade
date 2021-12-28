import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { createPool, sql } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'


const interceptors = [
    createFieldNameTransformationInterceptor({
        format: 'CAMEL_CASE'
    })
]

const initializeDatabase = async (server: FastifyInstance) => {
    const pool = createPool('postgres://', {
        interceptors
    })

    server.decorate('slonik', { pool })
    server.addHook('onClose', async () => {
        await pool.end()
    })
}

export default fastifyPlugin(initializeDatabase)

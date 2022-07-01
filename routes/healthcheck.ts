import { FastifyInstance } from 'fastify'
import { Static, Type } from '@sinclair/typebox'

import { handleError } from '../utilities/custom-errors'


const HealthCheckSchema = Type.Object({
    message: Type.String(),
    responseTime: Type.Tuple([Type.Number(), Type.Number()]),
    timestamp: Type.String(),
    uptime: Type.Number()
})

type HealthCheck = Static<typeof HealthCheckSchema>
const schema = { response: { 200: HealthCheckSchema } }

export default async (server: FastifyInstance): Promise<void> => {
    server.get(
        '/healthcheck',
        { schema },
        async (_request, reply) => {
            const healthcheck: HealthCheck = {
                message: 'OK',
                responseTime: process.hrtime(),
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }

            try {
                reply.send(healthcheck)
            } catch (reason) {
                handleError('API HEALTHCHECK ERROR: ', reason, reply)
            }
        }
    )
}

import fs from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export default fs(async (fastify) => {
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'AI Gateway',
                description: 'AI Gateway API Documentation',
                version: '1.0.0',
            }
        }
    })
    await fastify.register(swaggerUi, {
        routePrefix: '/docs'
        })
});
import Fastify from "fastify";
import crypto from 'node:crypto';


export function buildApp(opts = {}) {
    const app = Fastify({
        logger: opts.logger?? {
            level: process.env.LOG_LEVEL || 'info',
            transport: process.env.NODE_ENV === 'development' ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                }
            } :  undefined
        },
        genReqId : () => crypto.randomUUID(),
        ...opts,
    }); 

    app.register(import('./plugins/env.js'));
    app.register(import('./plugins/logger.js'));
    app.register(import('./plugins/swagger.js'));
    app.register(import('./plugins/prisma.js'));
    app.register(import('./plugins/redis.js'));
    app.register(import('./plugins/rate-limit.js'));
    app.register(import('./modules/health/health.routes.js'));
    app.register(import('./plugins/api-key.js'));
    app.register(import('./plugins/http-client.js'));
    app.register(import('./plugins/ai.js'));    
    app.register(import('./modules/auth/auth.routes.js'), { prefix: '/v1/auth' });
    app.register(import('./modules/ai/ai.routes.js'), {
        prefix: '/v1',
    });

    return app;
}
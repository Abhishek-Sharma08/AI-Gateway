import Fastify from "fastify";
import crypto from 'node:crypto';


export function buildApp(opts = {}) {
    const app = Fadtify({
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

    return app;
}
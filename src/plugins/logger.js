import fp from "fastify-plugin";

export default fp(async (fastify) => {
    fastify.log.info("Logger plugin loaded");
    fastify.addHook('onRequest', async (req, reply) => {
        req.log.info({
            method: req.method,
            url: req.url,
        }, 'Incoming request');
    });
});
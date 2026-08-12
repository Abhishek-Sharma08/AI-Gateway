import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";

async function rateLimitPlugin(fastify) {
    await fastify.register(rateLimit, {
        max:20,
        timeWindow: '1 minute',
        redis: fastify.redis,
        keyGenerator: (req) => req.headers["x-api-key"] || req.ip,
    })
}

export default fp(rateLimitPlugin, {
    name: "rate-limit",
})
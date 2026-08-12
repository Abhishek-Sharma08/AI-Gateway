import fp from "fastify-plugin";
import Redis from "ioredis";

async function redisPlugin(fastify) {
    const redis = new Redis(fastify.config.REDIS_URL);

    redis.on("error", (err) => {
        fastify.log.error({ err }, "Redis error");
    });

    fastify.decorate('redis', redis);

    fastify.addHook('onClose', async (app) => {
        await app.redis.quit();
    });
}

export default fp(redisPlugin, {
    name: "redis",
});
async function healthRoutes(fastify) {
    fastify.get("/health", async () => {
        return { status: "ok" };
    })

    fastify.get("/health/live", async () => {
        return { status: "alive" };
    })

    fastify.get("/health/ready", async (req, reply) => {
        try {
            await fastify.prisma.$queryRaw`SELECT 1`;
            return { status: "ready", database: "connected" };
        } catch (err) {
            reply.code(503);
            return { status: "not ready", database: "disconnected", error: err.message };
        }
    })
}

export default healthRoutes;
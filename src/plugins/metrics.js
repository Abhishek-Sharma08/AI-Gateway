import fp from "fastify-plugin";

async function metricsPlugin(fastify) {
    const metrics = {
        totalRequests: 0,
        totalErrors: 0,
        cacheHits: 0,
        cacheMisses: 0,
        totalLatencyMs: 0,
    }

    fastify.decorate("metrics", metrics);

    fastify.addHook("onResponse", async (request, reply) => {
        if (request.url.startsWith("/v1/chat/completions")) {
            metrics.totalRequests++;
            metrics.totalLatencyMs += reply.elapsedTime;
            if (reply.statusCode >= 400) {
                metrics.totalErrors++;
            }
        }
    })

    fastify.get("/metrics", async () => {
        const avgLatency = metrics.totalRequests > 0
            ? Math.round(metrics.totalLatencyMs / metrics.totalRequests)
            : 0;

        return {
            totalRequests: metrics.totalRequests,
            totalErrors: metrics.totalErrors,
            cacheHits: metrics.cacheHits,
            cacheMisses: metrics.cacheMisses,
            avgLatencyMs: avgLatency,
        };
    });
}

export default fp(metricsPlugin, {
    name: "metrics",
});
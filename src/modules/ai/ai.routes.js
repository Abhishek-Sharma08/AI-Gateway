import { chatCompletionSchema } from "./ai.schema.js";

async function aiRoutes(fastify) {
    fastify.post(
        "/chat/completions",
        {
            schema: chatCompletionSchema,
            preHandler: fastify.validateApiKey,
        },
        async (req, reply) => {
            if (req.body.stream) {
                reply.raw.writeHead(200, {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                });

                const stream = await fastify.aiService.chat(req.body);
                for await (const chunk of stream) {
                    reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`);
                }
                reply.raw.write("data: [DONE]\n\n");
                reply.raw.end();
                return reply;
            }

            const result = await fastify.aiService.chat(req.body);
            return result;
        }
    )
}

export default aiRoutes;
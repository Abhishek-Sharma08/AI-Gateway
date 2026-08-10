import fp from "fastify-plugin";

import { chatCompletionSchema } from "./ai.schema.js";

async function aiRoutes(fastify) {
    fastify.post(
        "/chat/completions",
        {
            schema: chatCompletionSchema,
            preHandler: fastify.validateApiKey,
        },
        async (req, res) => {

            console.log("Route hit");
            
            const result = await fastify.aiService.chat(req.body);

            console.log("Route response", result);

            return result;
        }
    )
}

export default aiRoutes;
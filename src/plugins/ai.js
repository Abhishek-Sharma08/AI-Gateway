import fp from "fastify-plugin";
import ProviderManager from "../modules/ai/providers/provider-manager.js";
import { GeminiAiProvider, OllamaAiProvider } from "../modules/ai/providers/index.js";
import AIService from "../modules/ai/ai.service.js";

async function aiPlugin(fastify) {
    const providerManager = new ProviderManager();

    const gemini = new GeminiAiProvider(
        {
            apiKey: fastify.config.GEMINI_API_KEY,
        },
        fastify.http
    );

    const ollama = new OllamaAiProvider({
        baseUrl: fastify.config.OLLAMA_BASE_URL,
    });

    providerManager.register("gemini", gemini);
    providerManager.register("ollama", ollama);

    fastify.decorate('providerManager', providerManager);

    const aiService = new AIService(providerManager);
    fastify.decorate('aiService', aiService);
}

export default fp(aiPlugin, {
    name: "ai-plugin",
})
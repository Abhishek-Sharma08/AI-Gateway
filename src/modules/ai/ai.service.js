import { buildCacheKey } from "./cache-key.js";

const CACHE_TTL_SECONDS = 300; // 5 minutes

const FALLBACK_PROVIDER = { gemini: "ollama", ollama: "gemini" };
const DEFAULT_MODEL = { gemini: "gemini-3.5-flash", ollama: "llama3.2" };

export default class AIService {
    constructor(providerManager, redis, metrics) {
        this.providerManager = providerManager;
        this.redis = redis;
        this.metrics = metrics;
    }

    async chat({
        provider = "gemini",
        model,
        messages,
        stream = false,
        thinkingBudget = 0,
    }) {
        const aiProvider = this.providerManager.get(provider);

        if (!aiProvider) {
            throw new Error(`Provider ${provider} not found`);
        }

        const cacheKey = buildCacheKey({ provider, model, messages, thinkingBudget });
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            this.metrics.cacheHits++;
            const parsed = JSON.parse(cached);
            return stream ? this.#replayAsStream(parsed) : parsed;
        }

        this.metrics.cacheMisses++;

        if (stream) {
            return this.#streamAndCache(aiProvider, { model, messages, thinkingBudget }, cacheKey);
        }

        try {
            const result = await aiProvider.chat({ model, messages, thinkingBudget });
            await this.redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL_SECONDS);
            return result;
        } catch (error) {
            return this.#tryFallback(provider, { messages, thinkingBudget },
                cacheKey, error)
        }
    }

    async #tryFallback(failedProvider, request, cacheKey, originalError) {
        const fallbackName = FALLBACK_PROVIDER[failedProvider];
        const fallbackProvider =  fallbackName && this.providerManager.get(fallbackName);

        if(!fallbackProvider) {
            throw originalError;
        }


        try {
            const fallbackModel =   DEFAULT_MODEL[fallbackName];
            const result = await fallbackProvider.chat({...request, model: fallbackModel});
            result.failedOver = { from: failedProvider, to: fallbackName };
            await this.redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL_SECONDS);
            return result;
       } catch (fallbackError) {
            throw originalError;
            
        }
    }

    async *#streamAndCache(aiProvider, request, cacheKey) {
        let fullContent = "";
        let lastMeta = { provider: request.provider, model: request.model };

        for await (const chunk of aiProvider.stream(request)) {
            fullContent += chunk.delta;
            lastMeta = { provider: chunk.provider, model: chunk.model };
            yield chunk;
        }

        const normalized = {
            id: null,
            provider: lastMeta.provider,
            model: lastMeta.model,
            message: { role: "assistant", content: fullContent },
            usage: null,
            finishReason: "STOP",
        };

        await this.redis.set(cacheKey, JSON.stringify(normalized), "EX", CACHE_TTL_SECONDS);
    }

    async *#replayAsStream(normalized) {
        yield {
            delta: normalized.message.content,
            provider: normalized.provider,
            model: normalized.model,
            cached: true,
        };
    }
}
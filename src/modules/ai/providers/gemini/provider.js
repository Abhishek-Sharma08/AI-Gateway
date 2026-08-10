import AIProvider from "../base/provider.js";

export default class GeminiAiProvider extends AIProvider {
    constructor(config, http) {
        super(config);
        this.http = http;
    }

    async chat(request) {
        const { body, statusCode } = await this.http.request(
            `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${this.config.apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: request.messages.map((message) => ({
                        role: message.role === "assistant" ? "model" : "user",
                        parts: [
                            {
                                text: message.content,
                            },
                        ],
                    })),
                    generationConfig: {
                        thinkingConfig: {
                            thinkingBudget: request.thinkingBudget ?? 0,
                        },
                    },
                }),
            }
        )

        const response = await body.json();

        return this.#normalize(response, request.model);
    }

    #normalize(response, model) {
        const candidate = response.candidates?.[0];
        const content = candidate?.content?.parts?.map(p => p.text).join("") ?? "";

        return {
            id: response.responseId ?? null,
            provider: "gemini",
            model,
            message: {
                role: "assistant",
                content,
            },
            usage: {
                promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
                completionTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
                totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
            },
            finishReason: candidate?.finishReason ?? null,
        }
    }

    async *stream() {
        throw new Error("Not implemented")
    }
}
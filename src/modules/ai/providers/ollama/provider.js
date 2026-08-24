import AIProvider from "../base/provider.js";
import { withRetry } from "../../retry.js";

export default class OllamaProvider extends AIProvider {
    constructor(config, http) {
        super(config);
        this.http = http;
        this.baseUrl = config.baseUrl;
    }

    async chat(req) {
        return withRetry(() => this.#doChat(req));
    }

    async #doChat(req) {
        const { body, statusCode } = await this.http.request(
            `${this.baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: req.model,
                messages: req.messages,
                stream: false,
            }),
        }
        )

        const response = await body.json();

        if (statusCode >= 400) {
            const err = new Error(response.error ?? "ollama request failed");
            err.statusCode = statusCode;
            throw err;
        }

        return this.#normalize(response, req.model);
    }

        async *stream(req) {
        const { body } = await this.http.request(
            `${this.baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: req.model,
                messages: req.messages,
                stream: true,
            })
        }
        )

        let buffer = "";
        for await (const chunk of body) {
            buffer += chunk.toString();

            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;

                const parsed = JSON.parse(line);
                const text = parsed.message?.content ?? "";

                if (text) {
                    yield { delta: text, provider: "ollama", model: req.model };
                }

                if (parsed.done) return;
            }
        }
    }

    #normalize(response, model) {
        return {
            id: null,
            provider: "ollama",
            model,
            message: {
                role: "assistant",
                content: response.message?.content ?? "",
            },
            usage: {
                promptTokens: response.prompt_eval_count ?? 0,
                completionTokens: response.eval_count ?? 0,
                totalTokens: (response.prompt_eval_count ?? 0) + (response.eval_count ?? 0),
            },
            finishReason: response.done_reason ?? null,
        };
    }
}

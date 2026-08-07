import crypto from "node:crypto";
import AIProvider from "../base/provider.js";

export default class GeminiAiProvider extends AIProvider {
    constructor(config, http) {
        super(config);
        this.http = http;
    }

    async chat(request) {
        console.log("INSIDE GEMINI PROVIDER");

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
                }),
            }
        );

        const response = await body.json();

        console.log("========== GEMINI ==========");
        console.log("Status:", statusCode);
        console.dir(response, { depth: null });
        console.log("============================");

        // TEMPORARY: return raw response for debugging
        return response;
    }

    async *stream() {
        throw new Error("Not implemented");
    }
}
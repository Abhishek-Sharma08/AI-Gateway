export const chatCompletionSchema = {
    body: {
        type: "object",
        required: ["provider", "model", "messages"],
        properties: {
            provider: {
                type: "string",
                enum: ["gemini", "ollama"],
            },
            model: {
                type: "string",
            },
            stream: {
                type: "boolean",
                default: false,
            },
            thinkingBudget: {
                type: "integer",
                default: 0,
                minimum: 0,
                description: "Gemini-only: caps internal reasoning tokens. 0 disables thinking entirely. Ignored by providers that don't support it.",
            },
            messages: {
                type: "array",
                minItems: 1,
                items: {
                    type: "object",
                    required: ["role", "content"],
                    properties: {
                        role: {
                            type: "string",
                            enum: ["user", "assistant", "system"],
                        },
                        content: {
                            type: "string",
                        }
                    }
                }
            }
        }
    }
}
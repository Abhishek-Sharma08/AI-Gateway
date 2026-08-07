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
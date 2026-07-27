export const envSchema = {
    type: 'object',
    required: ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'],
    properties: {
        PORT: { type: 'number', default: 3000 },
        NODE_ENV: { type: 'string', default: 'development' },
        LOG_LEVEL: { type: 'string', default: 'info' },
        DATABASE_URL: { type: 'string' },
        REDIS_URL: { type: 'string' },
        JWT_SECRET: { type: 'string' },
        OPENAI_API_KEY: { type: 'string' },
        OLLAMA_BASE_URL: { type: 'string', default: 'http://localhost:11434' },
    }
}
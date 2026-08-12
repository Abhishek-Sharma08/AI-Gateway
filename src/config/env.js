export const envSchema = {
    type: 'object',
required: ['DATABASE_URL', 'API_KEY', 'REDIS_URL'],
    properties: {
        PORT: { type: 'number', default: 3000 },
        NODE_ENV: { type: 'string', default: 'development' },
        LOG_LEVEL: { type: 'string', default: 'info' },
        DATABASE_URL: { type: 'string' },
        REDIS_URL: { type: 'string' },
        API_KEY: { type: 'string' },
        GEMINI_API_KEY: { type: 'string' },
        OLLAMA_BASE_URL: { type: 'string', default: 'http://localhost:11434' },
    }
}
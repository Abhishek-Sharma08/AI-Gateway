import crypto from 'node:crypto';

export function buildCacheKey({ provider, model, messages, thinkingBudget }) {
    const payload = JSON.stringify({ provider, model, messages, thinkingBudget });
    const hash = crypto.createHash("sha256").update(payload).digest("hex");
    return `ai-cache-${provider} : ${model} : ${hash}`;
}
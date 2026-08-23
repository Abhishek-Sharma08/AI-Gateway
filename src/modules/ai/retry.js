export async function withRetry(fn, {retries = 3, baseDelayMs = 500} = {}) {
    let lastError;

    for(let attemp = 0; attemp <= retries; attemp++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            const status = error.statusCode ?? error.status;
            const isRetryable = !status || status >= 500 || status === 429;

            if(!isRetryable || attemp === retries) {
                throw error;
            }

            const delay = baseDelayMs * 2 ** attemp;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
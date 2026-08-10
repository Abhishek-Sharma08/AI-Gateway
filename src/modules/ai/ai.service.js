export default class AIService {
    constructor(providerManager) {
        this.providerManager = providerManager;
    }
    
    async chat({
        provider = "gemini",
        model,
        messages,
        stream = false,
        thinkingBudget = 0,
    }) {
        const aiProvider = this.providerManager.get(provider);

        if(!aiProvider) {
            throw new Error(`Provider ${provider} not found`);
        }

        if(stream) {
            return aiProvider.stream({ model, messages, thinkingBudget });
        }

        return aiProvider.chat({ model, messages, thinkingBudget });
    }
}
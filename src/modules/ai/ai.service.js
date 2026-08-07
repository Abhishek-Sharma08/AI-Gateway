export default class AIService {
    constructor(providerManager) {
        this.providerManager = providerManager;
    }
    
    async chat({
        provider = "gemini",
        model,
        messages,
        stream = false,
    }) {
        const aiProvider = this.providerManager.get(provider);

        if(!aiProvider) {
            throw new Error(`Provider ${provider} not found`);
        }

        if(stream) {
            return aiProvider.chat({ model, messages });
        }

            console.log("Provider", provider);
            
        return aiProvider.chat({ model, messages });
    }
}
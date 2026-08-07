import AIProvider from "../base/provider.js";

export default class OllamaProvider extends AIProvider {
    constructor(config = {}) {
        super(config);
    }

    async chat(req){
        throw new Error("OllamaProvider must implement chat method");
    }

    async *stream(req){
        throw new Error("OllamaProvider must implement chat method");
    }
}
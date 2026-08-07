export default class ProviderManager {
    constructor() {
        this.provider = new Map();
    }

    register(name, provider) {
        this.provider.set(name, provider);
    }

    get(name) {
        return this.provider.get(name);
    }

    has(name) {
        return this.provider.has(name);
    }

    list() {
        return [...this.provider.keys()];
    }
}
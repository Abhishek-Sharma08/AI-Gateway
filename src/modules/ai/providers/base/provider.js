export default class AIProvider {
    constructor(config = {}) {
        this.config = config;
    }

    async chat(req){
        throw new Error(`${this.cosnstructor.name} must implement chat method`);
    }

    async *stream(req) {
        throw new Error(`${this.cosnstructor.name} must implement stream method`);
    }
}
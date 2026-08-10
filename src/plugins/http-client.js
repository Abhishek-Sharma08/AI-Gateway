import fp from "fastify-plugin";
import { Agent, request } from "undici";

async function httpClientPlugin(fastify) {
    const agent = new Agent({
        connections: 10,
        pipelining: 1,
    });

     fastify.decorate("http", {
        request: (url, options = {}) =>
            request(url, {
                dispatcher: agent,
                headersTimeout: 30_000,
                bodyTimeout: 60_000,
                ...options,
            }),
    })

    fastify.addHook("onClose", async () => {
        await agent.close();
    })
}

export default fp(httpClientPlugin, {
    name: "http-client",
})
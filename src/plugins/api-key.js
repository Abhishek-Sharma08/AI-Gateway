import fp from "fastify-plugin";    

async function apiKeyPlugin(fastify) {
    fastify.decorate('validateApiKey', async (req, reply) => {
        const key = req.headers['x-api-key'];
        
        if(!key) {
            return reply.code(401).send({error: 'Missing API key'});
        }

        if(key != fastify.config.API_KEY) {
            return reply.code(401).send({error: 'Invalid API key'});
        }
    })
}

export default fp(apiKeyPlugin, {
    name: "api-key",
})
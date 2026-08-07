import crypto from 'node:crypto';

export default async function authRoutes(fastify){
    fastify.post('/keys', {

    },
    async (req, res) => {
        const key = `sk-${crypto.randomUUID()}`;
        const apiKey = await fastify.prisma.apiKey.create({
            data: {key, name: req.body.name, role: req.body.role ?? 'MEMBER'}
        })
        return res.code(201).send({key: apiKey.key})
    })
}
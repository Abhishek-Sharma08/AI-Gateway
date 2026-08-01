import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

export default fp(async (fastify) => {
    await fastify.register(jwt, {
        secret: fastify.config.JWT_SECRET
    })

    fastify.decorate('authenticate', async (req, res) => {
        try {
            await req.jwtVerify();
        } catch (error) {
            res.code(401).send({ error: "Unauthorized" });
        }
    })
})
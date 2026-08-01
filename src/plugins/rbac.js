import fp from "fastify-plugin";

export default fp(async (fastify) => {
    fastify.decorate('requireRole', async (allowedRoles) => {
            return async (req, res) => {
                const userRole = req.user?.role;
                if(!allowedRoles.includes(userRole)) {
                    return res.code(403).send({ error: "Forbidden" });
                }
            }
    })
})
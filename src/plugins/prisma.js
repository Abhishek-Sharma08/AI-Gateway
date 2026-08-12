import fp from "fastify-plugin";
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

export default fp(async (fastify) => {
    const adapter = new PrismaPg({ connectionString: fastify.config.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });
    await prisma.$connect();

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (app) => {
        await app.prisma.$disconnect();
    });
});
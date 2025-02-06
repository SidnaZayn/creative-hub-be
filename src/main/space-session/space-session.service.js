import { PrismaClient, Days } from '@prisma/client';

const prisma = new PrismaClient();

const createSpaceSession = async (dbClient = prisma, body) => {
    body.day = Days[body.day];
    body.price = parseInt(body.price);
    body.capacity = parseInt(body.capacity);
    const data = await dbClient.spaceSession.create({
        data: body,
    });

    return data;
};

const getSpaceSessions = async (params) => {
    let where = {};
    let size = 100;
    let page = 0;

    if (params.page) {
        page = parseInt(params.page);
    }
    if (params.size) {
        size = parseInt(params.size);
    }

    if (params.spaceId) {
        where.spaceId = params.spaceId;
    }
    try {
        const data = await prisma.spaceSession.findMany({
            skip: page * size,
            take: size,
            where: where,
        });
        const count = await prisma.spaceSession.count({
            skip: page * size,
            take: size,
            where: where,
        });

        return { data, count };
    } catch (error) {
        throw error;
    }
};

const getSpaceSessionById = async (id) => {
    const data = await prisma.spaceSession.findUnique({
        where: {
            id,
        },
    });

    if (!data) {
        throw new Error('space session not found');
    }

    return data;
};

const deleteSpaceSession = async (id) => {
    const data = await prisma.spaceSession.delete({
        where: {
            id,
        },
    });

    return data;
};

export default { createSpaceSession, getSpaceSessions, getSpaceSessionById, deleteSpaceSession };

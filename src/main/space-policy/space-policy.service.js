import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSpacePolicy = async (dbClient = prisma, body) => {
    const data = await dbClient.policy.create({
        data: body,
    });

    return data;
};

const getSpacePolicies = async (spaceId) => {
    // Policy dosent need page, size and query
    try {
        const data = await prisma.policy.findMany({
            where: {
                spaceId,
            },
        });
        const count = await prisma.policy.count({
            where: {
                spaceId,
            },
        });

        return { data, count };
    } catch (error) {
        throw error;
    }
};

const getSpacePolicyById = async (id) => {
    const data = await prisma.policy.findUnique({
        where: {
            id,
        },
    });

    if (!data) {
        throw new Error('space Policy not found');
    }

    return data;
};

const updateSpacePolicy = async (id, newPolicy) => {
    const data = await prisma.policy.update({
        where: {
            id,
        },
        data: {
            policy: newPolicy,
        },
    });

    return data;
};

const deleteSpacePolicy = async (id) => {
    const data = await prisma.policy.delete({
        where: {
            id,
        },
    });

    return data;
};

export default {
    createSpacePolicy,
    getSpacePolicies,
    getSpacePolicyById,
    updateSpacePolicy,
    deleteSpacePolicy,
};

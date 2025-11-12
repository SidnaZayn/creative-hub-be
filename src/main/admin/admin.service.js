import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Inserts a new user role into the userRole table.
 * @param {Object} data - The user role data to insert.
 * @param {number} data.userId - The ID of the user.
 * @param {number} data.roleId - The ID of the role.
 * @returns {Promise<Object>} The created userRole record.
 */
async function insertUserRole(userId, roleId) {
    return await prisma.userRole.create({
        data: {
            userId: userId,
            roleId: roleId,
        },
    });
}

export default { insertUserRole };
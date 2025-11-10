import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOwnerBookings = async (ownerId, { status, history } = {}) => {
  const whereClause = {
    spaceSession: {
      space: {
        ownerId: ownerId,
      },
    },
  };

  if (status) {
    whereClause.status = status;
  }

  const now = new Date();
  if (history === true) {
    whereClause.date = { lt: now };
  } else if (history === false) {
    whereClause.date = { gte: now };
  }
  // If history is null or undefined, do not filter by date

  const data = await prisma.booking.findMany({
    where: whereClause,
    orderBy: { date: "asc" },
    include: {
      spaceSession: {
        include: {
          space: true,
        },
      },
    },
  });

  return { data, count: data.length };
};

export const getSpaceBookings = async (ownerId, spaceId) => {
  const data = await prisma.booking.findMany({
    where: {
      spaceSession: {
        space: {
          ownerId: ownerId,
          id: spaceId,
        },
      },
    },
    orderBy: { date: "asc" },
  });
  return { data, count: data.length };
};

export const getOwnerSpaces = async (ownerId) => {
  const data = await prisma.space.findMany({
    where: {
      ownerId: ownerId,
    },
  });
  return { data, count: data.length };
};

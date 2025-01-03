import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSpace = async (body) => {
  const data = await prisma.space.create({
    data: {
      name: body.name,
      ownerId: body.ownerId,
      description: body.description,
      location: body.location,
      features: body.features,
      capacity: body.capacity,
      pricePerHour: body.pricePerHour,
    },
  });

  // if (error) {
  //   throw error;
  // }

  return data;
};

const getSpaces = async (params) => {
  let page = 0;
  let size = 10;
  let where = {};

  if (params.page) {
    page = params.page;
  }

  if (params.size) {
    size = params.size;
  }

  const data = await prisma.space.findMany({
    skip: page * size,
    take: size,
  });

  return data;
};

const getSpaceById = async (id) => {
  const data = await prisma.space.findUnique({
    where: { id },
  });

  if (!data) {
    throw new Error('space not found');
  }

  return data;
};

const updateSpace = async (id, body) => {
  try {
    const data = await prisma.space.update({
      where: { id },
      data: body,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const deleteSpace = async (id) => {
  try {
    const data = await prisma.space.delete({
      where: { id },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export default { getSpaces, getSpaceById, createSpace, updateSpace, deleteSpace };

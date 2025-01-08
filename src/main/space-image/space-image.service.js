import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSpaceImage = async (dbClient = prisma,body) => {
  const data = await dbClient.spaceImage.create({
    data: {
      filename: body.filename,
      spaceId: body.spaceId,
      size: body.size,
      url: body.url,
    },
  });

  return data;
};

const getSpaceImages = async (params) => {
  try {
    const data = await prisma.spaceImage.findMany({
      where: {
        spaceId: params.spaceId,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const getSpaceImageById = async (id) => {
  const data = await prisma.spaceImage.findUnique({
    where: {
      id,
    },
  });

  if (!data) {
    throw new Error('space image not found');
  }
  
  return data;
};

const deleteSpaceImage = async (id) => {
  const data = await prisma.spaceImage.delete({
    where: {
      id,
    },
  });

  return data;
};

export default { createSpaceImage, getSpaceImages, getSpaceImageById, deleteSpaceImage };

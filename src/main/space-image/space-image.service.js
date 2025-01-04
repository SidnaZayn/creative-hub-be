import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSpaceImage = async (body) => {
  const data = await prisma.spaceImage.create({
    data: {
      filename: body.filename,
      spaceId: body.spaceId,
      size: body.size,
      url: body.url
    },
  });

  return data;
};

const getSpaceImages = async (spaceId) => {
  const data = await prisma.spaceImage.findMany({
    where: {
      spaceId,
    },
  });

  return data;
};

export default { createSpaceImage, getSpaceImages };

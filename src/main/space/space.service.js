import { PrismaClient } from '@prisma/client';
import spaceImage from '../space-image/space-image.service.js';

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
      categoryId: body.categoryId,
    },
  });

  return data;
};

const createSpaceWithImage = async (body) => {
  // if (body.images === undefined || body.images.length === 0) throw new Error('space images is required!');

  const spaceData = await createSpace(body);

  const spaceImages = body.images.map(async (img) => {
    const imgData = await spaceImage.createSpaceImage({
      filename: img.filename,
      spaceId: spaceData.id,
      size: img.size,
      url: img.url,
    });
    const size = JSON.stringify(imgData.size);
    return { size: size, ...imgData };
  });

  const imagesData = await Promise.all(spaceImages);

  return { ...spaceData, images: imagesData };
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

  if (params.name) {
    where.name = {
      contains: params.name,
    };
  }

  const data = await prisma.space.findMany({
    skip: page * size,
    take: size,
    where: where,
  });

  const count = await prisma.space.count({
    where: where,
  });

  if (!data) throw new Error('spaces not found');

  return { data, count };
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

export default {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
  createSpaceWithImage,
};

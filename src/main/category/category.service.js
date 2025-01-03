import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCategory = async (body) => {
  try {
    const data = await prisma.category.create({
      data: {
        name: body.name,
      },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const getCategories = async (params) => {
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

  const data = await prisma.category.findMany({
    skip: page * size,
    take: size,
    where: where,
  });

  const count = await prisma.category.count({
    where,
  });

  if (!data) {
    throw new Error('categories not found');
  }

  return { data, count };
};

const getCategoryById = async (id) => {
  const data = await prisma.category.findUnique({
    where: { id },
  });

  if (!data) {
    throw new Error('category not found');
  }

  return data;
};

const updateCategory = async (id, body) => {
  try {
    const data = await prisma.category.update({
      where: { id },
      data: body,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const data = await prisma.category.delete({
      where: { id },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export default { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };

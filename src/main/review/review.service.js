import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createReview = async (body, dbClient = prisma) => {
  try {
    const data = await dbClient.review.create({
      data: body,
    })
    return data;
  } catch (error) {
    throw error; 
  }
};

const getReviewsBySpaceId = async (spaceId, params) => {
  try {
    let where = { spaceId };
    let size = 10;
    let page = 0;
    if (params.rating) {
      where.rating = parseInt(params.rating);
    }
    if (params.page) {
      page = parseInt(params.page);
    }
    if (params.size) {
      size = parseInt(params.size);
    }
    const data = await prisma.review.findMany({
      skip: page * size,
      take: size,
      where: where,
      include: { space: true },
    });
    const count = await prisma.review.count({
      skip: page * size,
      take: size,
      where: where,
    });
    return { data, count };
  } catch (error) {
    throw error;
  }
};

const editReview = async (id, body) => {
  const data = await prisma.review.update({
    where: { id },
    data: body,
  });
  return data;
};

const deleteReview = async (id) => {
  const data = await prisma.review.delete({
    where: { id },
  });
  return data;
}

export default { createReview, getReviewsBySpaceId, editReview, deleteReview };

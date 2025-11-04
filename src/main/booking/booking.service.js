import { Days, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createBooking = async (body, dbClient = prisma) => {
  try {
    const data = await dbClient.booking.create({
      data: body,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const getBookings = async (params, userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  let where = {
    userId: userId,
  };
  let size = 100;
  let page = 0;
  if (params.page) {
    page = parseInt(params.page);
  }
  if (params.size) {
    size = parseInt(params.size);
  }
  try {
    const data = await prisma.booking.findMany({
      skip: page * size,
      take: size,
      where: where,
    });
    const count = await prisma.booking.count({
      skip: page * size,
      take: size,
      where: where,
    });
    return { data, count };
  } catch (error) {
    throw error;
  }
};

const getBookingById = async (id) => {
  const data = await prisma.booking.findUnique({
    where: {
      id,
    },
  });
  if (!data) {
    throw new Error("booking not found");
  }
  return data;
};

const updateBooking = async (id, body) => {
  try {
    const data = await prisma.booking.update({
      where: { id },
      data: body,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteBooking = async (id) => {
  try {
    const data = await prisma.booking.delete({
      where: { id },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
export default { createBooking, getBookings, getBookingById, updateBooking, deleteBooking };

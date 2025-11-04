import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const getUpcomingBookings = async (userId, status) => {
  const now = new Date();
  const where = {
    userId,
    date: { gte: now },
    ...(status ? { status } : {}),
  };
  const data = await prisma.booking.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return {data, count: data.length};
};

export const getBookingHistory = async (userId, status) => {
  const now = new Date();
  const where = {
    userId,
    date: { lt: now },
    ...(status ? { status } : {}),
  };
  const data = await prisma.booking.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return {data, count: data.length}
};

export const cancelBooking = async (userId, bookingId) => {
  const data = await prisma.booking.updateMany({
    where: {
      id: bookingId,
      userId: userId,
    },
    data: {
      status: 'CANCEL'
    }
  }); 
  if (data.count === 0) {
    throw new Error("booking not found or cannot be cancelled");
  }
  return {data};
}

export const getBookingById = async (userId,bookingId) => {
  const data = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      userId: userId
    },
  });
  if (!data) {
    throw new Error("booking not found");
  }
  return {data};
}

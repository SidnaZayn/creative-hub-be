import express from "express";
import { getUpcomingBookings, getBookingHistory, cancelBooking, getBookingById } from "./user-dashboard.service.js";
import { BookingStatus } from "@prisma/client";
import verifyToken from "../../../middleware/auth.guard.js";

const router = express.Router();

router.get("/bookings", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    const bookings = await getUpcomingBookings(userId, status);
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking-history", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const bookings = await getBookingHistory(userId, status);
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/booking/:id/cancel", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const result = await cancelBooking(userId, bookingId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking/:id", verifyToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const result = await getBookingById(userId, bookingId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

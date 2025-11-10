import express from "express";
import {
  getOwnerBookings,
  getOwnerSpaces,
  getSpaceBookings,
} from "./owner-dashboard.service.js";
import { BookingStatus } from "@prisma/client";
import verifyToken from "../../../middleware/auth.guard.js";

const router = express.Router();

router.get("/bookings", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    const bookings = await getOwnerBookings(userId, { status });
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/upcoming-bookings", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    const bookings = await getOwnerBookings(userId, { status, history: false });
    return res.status(200).json(bookings.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/booking-history", verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    const bookings = await getOwnerBookings(userId, { status, history: true });
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/spaces", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const spaces = await getOwnerSpaces(userId);
    return res.status(200).json(spaces.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/spaces/:spaceId/bookings", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { spaceId } = req.params;
    const bookings = await getSpaceBookings(userId, spaceId);
    return res.status(200).json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
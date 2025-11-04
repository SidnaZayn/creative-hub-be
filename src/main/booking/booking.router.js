import express from "express";
import verifyToken from "../../middleware/auth.guard.js";
import bookingService from "./booking.service.js";

const router = express.Router();

router.post("/booking", verifyToken, async (req, res) => {
  try {
    const body = req.body;
    const data = await bookingService.createBooking(body);
    return res.status(201).json({ data, message: "success create booking" });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
});

router.get("/bookings", verifyToken, async (req, res) => {
  try {
    let params = {};
    if (req.query.page) {
      params.page = req.query.page;
    }
    if (req.query.size) {
      params.size = req.query.size;
    }
    
    const result = await bookingService.getBookings(params, req.user.id);
    return res.status(200).json({ data: result.data, count: result.count });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

router.get("/booking/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await bookingService.getBookingById(id);
    return res.status(200).json({ data, message: "success get booking" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get booking",
      error: error.message,
    });
  }
});

router.put("/booking/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const data = await bookingService.updateBooking(id, body);
    return res.status(200).json({ data, message: "success update booking" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
});

router.delete("/booking/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await bookingService.deleteBooking(id);
    return res.status(200).json({ data, message: "success delete booking" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
});

router.patch("/booking/:id/cancel", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await bookingService.updateBooking(id, { status: "CANCEL" });
    return res.status(200).json({ data, message: "success cancel booking" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
});

router.patch("/booking/:id/paid", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await bookingService.updateBooking(id, { status: 'PAID' });
    return res.status(200).json({ data, message: "success mark booking as paid" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to mark booking as paid",
      error: error.message,
    });
  }
});

export default router;

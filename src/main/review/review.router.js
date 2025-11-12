import express from "express";
import reviewService from "./review.service.js";
import verifyToken from "../../middleware/auth.guard.js";

const router = express.Router();

router.get("/spaces/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 0, size = 10, rating } = req.query;
    const reviews = await reviewService.getReviewsBySpaceId(id, { page, size, rating });
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/spaces/:id/reviews", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (rating > 5 || rating < 1) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const userId = req.user.id;
    const newReview = await reviewService.createReview({
      rating,
      comment,
      userId,
      spaceId: id,
    });
    return res.status(201).json(newReview);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/spaces/:id/reviews/:reviewId", verifyToken, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (req.body.rating > 5 || req.body.rating < 1) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const updatedReview = await reviewService.editReview(reviewId, req.body);
    return res.status(200).json(updatedReview);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/spaces/:id/reviews/:reviewId", verifyToken, async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const deletedReview = await reviewService.deleteReview(reviewId);
    return res.status(204).json(deletedReview);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

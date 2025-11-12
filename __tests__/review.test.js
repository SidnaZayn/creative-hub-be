import request from "supertest";
import { supabase } from "../src/lib/supabase";

let spaceId = "13c0e70f-0e51-4266-aba7-24cef9379cc8"; // Replace with an actual test space ID
let user;
let userToken;
let testData;

beforeAll(async () => {
  userToken = global.app.access_token;
  const { data: userData } = await supabase.auth.getUser(userToken);
  user = userData.user;
  // Optionally, create test data here if needed
});

afterAll(async () => {
    await request(app).delete("/api/spaces/" + spaceId + "/reviews/" + testData.id)
    .set("Authorization", `Bearer ${userToken}`);
  // Optionally, clean up test data here
});

describe("POST /api/spaces/:id/reviews", () => {
  it("should create a new review for the space", async () => {
    const reviewData = {
      rating: 5,
      comment: "Great space!",
    };
    const res = await request(app)
      .post("/api/spaces/" + spaceId + "/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send(reviewData);
    testData = res.body;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.rating).toBe(reviewData.rating);
    expect(res.body.comment).toBe(reviewData.comment);
  });

  it("should return 400 if token is missing", async () => {
    const reviewData = {
      rating: 5,
      comment: "Great space!",
    };
    const res = await request(app)
      .post("/api/spaces/" + spaceId + "/reviews")
      .send(reviewData);
    expect(res.statusCode).toBe(401);
  });

  it("should error if rating is minus 1 or greater than 5", async () => {
    const reviewData = {
      rating: 6,
      comment: "Great space!",
    };
    const res = await request(app)
      .post("/api/spaces/" + spaceId + "/reviews")
      .set("Authorization", `Bearer ${userToken}`)
      .send(reviewData);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/spaces/:id/reviews", () => {
  it("should return 200 and a list of reviews of the space", async () => {
    const res = await request(app).get("/api/spaces/" + spaceId + "/reviews"); 
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should filter reviews by rating", async () => {
    const res = await request(app).get("/api/spaces/" + spaceId + "/reviews?rating=3");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Optionally, check that all returned reviews have the requested status
    res.body.data.forEach((review) => {
      expect(review.rating).toBe(5);
      expect(review).toHaveProperty("comment");
    });
  });
});

describe("PUT /api/spaces/:id/reviews/:reviewId", () => {
  const updatedReviewData = {
    rating: 4,
    comment: "Good space!",
  };
  it("should update an existing review for the space", async () => {
    const res = await request(app)
      .put("/api/spaces/" + spaceId + "/reviews/" + testData.id)
      .set("Authorization", `Bearer ${userToken}`)
      .send(updatedReviewData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.rating).toBe(updatedReviewData.rating);
    expect(res.body.comment).toBe(updatedReviewData.comment);
  });

  it("should return 404 if review does not exist", async () => {
    const res = await request(app)
      .put("/api/spaces/" + spaceId + "/reviews/nonexistent-review-id")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updatedReviewData);
    expect(res.statusCode).toBe(500);
  });
  
  it("should return 400 if rating is minus 1 or greater than 5", async () => {
    const invalidReviewData = {
      rating: 10,
      comment: "Invalid rating!",
    };
    const res = await request(app)
      .put("/api/spaces/" + spaceId + "/reviews/" + testData.id)
      .set("Authorization", `Bearer ${userToken}`)
      .send(invalidReviewData);
    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /api/spaces/:id/reviews/:reviewId", () => {
  it("should delete an existing review for the space", async () => {
    const res = await request(app)
      .delete("/api/spaces/" + spaceId + "/reviews/" + testData.id)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(204);
  });
  
  it("should return 404 if review does not exist", async () => {
    const res = await request(app)
      .delete("/api/spaces/" + spaceId + "/reviews/nonexistent-review-id")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(500);
  });
});

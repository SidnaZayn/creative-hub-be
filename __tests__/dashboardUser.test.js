import request from "supertest";
import { supabase } from "../src/lib/supabase";
import { after } from "node:test";

let user;
let userToken;
let testData;
beforeAll(async () => {
  userToken = global.app.access_token;
  const { data: userData } = await supabase.auth.getUser(userToken);
  user = userData.user;

  testData = await request(global.app)
    .post("/api/booking")
    .set("Authorization", "Bearer " + userToken)
    .send({
      date: new Date(),
      spaceSessionId: "f32150ef-db32-4c83-aa82-3a4217e156b8",
      userId: user.id,
      name: "Test Booking",
    })
    .then((res) => res.body.data);
});

describe("GET /dashboard/user/bookings", () => {
  test("fetch all upcoming user bookings", async () => {
    const response = await request(global.app)
      .get("/api/dashboard/user/bookings")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("fetch data with PAID status", async () => {
    const response = await request(global.app)
      .get("/api/dashboard/user/bookings?status=PAID")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("fetch data with UNPAID status", async () => {
    const response = await request(global.app)
      .get("/api/dashboard/user/bookings?status=UNPAID")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("fetch data with CANCEL status", async () => {
    const response = await request(global.app)
      .get("/api/dashboard/user/bookings?status=CANCEL")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe("GET /dashboard/user/booking-history", () => {
  test("fetch all user booking history", async () => {
    const response = await request(global.app)
      .get("/api/dashboard/user/booking-history")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe("PATCH /dashboard/user/booking/:id/cancel", () => {
  test("cancel a booking", async () => {
    const response = await request(global.app)
      .patch(`/api/dashboard/user/booking/${testData.id}/cancel`)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("count", 1);
  });
});

describe("GET /dashboard/user/booking/:id", () => {
  test("fetch booking by id", async () => {
    const response = await request(global.app)
      .get(`/api/dashboard/user/booking/${testData.id}`)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", testData.id);
  });
  test("fetch booking by invalid id", async () => {
    const response = await request(global.app)
      .get("/api/dashboard/user/booking/0")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

afterAll(async () => {
  await request(global.app)
    .delete("/api/booking/" + testData.id)
    .set("Authorization", "Bearer " + userToken);
});

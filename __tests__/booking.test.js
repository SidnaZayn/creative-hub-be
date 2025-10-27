import request from "supertest";
import { supabase } from "../src/lib/supabase";

const SPACE_SESSION_ID = "f32150ef-db32-4c83-aa82-3a4217e156b8"; //always change it for test
let user, userToken, testData, bookingId;
beforeAll(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "zidnazen@gmail.com",
    password: "11223344",
  });
  const { access_token, refresh_token } = data.session;

  userToken = access_token;
  const { data: userData } = await supabase.auth.getUser();
  user = userData.user;
});

describe("POST /api/booking", () => {
  test("create booking with valid data", async () => {
    const date = new Date();
    const response = await request(global.app)
      .post("/api/booking")
      .set("Authorization", "Bearer " + userToken)
      .send({
        date: date,
        spaceSessionId: SPACE_SESSION_ID,
        userId: user.id,
        name: "Test Booking",
      });
    testData = response.body.data;
    bookingId = testData.id;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
  }, 10000);

  test("create booking with invalid data", async () => {
    const response = await request(global.app)
      .post("/api/booking")
      .set("Authorization", "Bearer " + userToken)
      .send({
        date: "",
        spaceSessionId: "",
        userId: user.id,
        name: "Test Booking",
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.message).toBe("Failed to create booking");
  });
});

describe("GET /api/bookings", () => {
  test("fetch all bookings", async () => {
    const response = await request(global.app)
      .get("/api/bookings")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
  test("fetch bookings with userId filter", async () => {
    const response = await request(global.app)
      .get(`/api/bookings?userId=${user.id}`)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
describe("GET /api/booking/:id", () => {
  test("fetch booking by id", async () => {
    const response = await request(global.app)
      .get("/api/booking/" + bookingId)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", bookingId);
    expect(response.body.data).toHaveProperty("name", "Test Booking");
  });
  test("fetch booking by invalid id", async () => {
    const response = await request(global.app)
      .get("/api/booking/0")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

describe("PUT /api/booking/:id", () => {
  test("update booking by id", async () => {
    const response = await request(global.app)
      .put("/api/booking/" + bookingId)
      .set("Authorization", "Bearer " + userToken)
      .send({
        name: "Updated Booking Name",
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", bookingId);
    expect(response.body.data).toHaveProperty("name", "Updated Booking Name");
  });
});

describe("PATCH /api/booking/:id/paid", () => {
  test("mark booking as paid", async () => {
    const response = await request(global.app)
      .patch("/api/booking/" + bookingId + "/paid")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", bookingId);
    expect(response.body.data).toHaveProperty("status", "PAID");
  });
});

describe("PATCH /api/booking/:id/cancel", () => {
  test("cancel booking", async () => {
    const response = await request(global.app)
      .patch("/api/booking/" + bookingId + "/cancel")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", bookingId);
    expect(response.body.data).toHaveProperty("status", "CANCEL");
  });
});

describe("DELETE /api/booking/:id", () => {
  test("delete booking by id", async () => {
    const response = await request(global.app)
      .delete("/api/booking/" + bookingId)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id", bookingId);
  });
});
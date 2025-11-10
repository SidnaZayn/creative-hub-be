import request from "supertest";
import { supabase } from "../src/lib/supabase";

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
  // Optionally, clean up test data here
});

describe("GET /api/dashboard/owner/bookings", () => {
  it("should return 200 and a list of bookings for the owner's spaces", async () => {
    const res = await request(app)
      .get("/api/dashboard/owner/bookings")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should filter bookings by status", async () => {
    const res = await request(app)
      .get("/api/dashboard/owner/bookings?status=PAID")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Optionally, check that all returned bookings have the requested status
    res.body.data.forEach((booking) => {
      expect(booking.status).toBe("PAID");
    });
  });
});

describe("GET /api/dashboard/owner/upcoming-bookings", () => {
  it("should return 200 and a list of upcoming bookings for the owner's spaces", async () => {
    const res = await request(app)
      .get("/api/dashboard/owner/upcoming-bookings")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach((booking) => {
      expect(booking.status).toBe("PAID");
    });

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("spaceId");
      expect(res.body[0]).toHaveProperty("userId");
      expect(res.body[0]).toHaveProperty("status");
    } 
  });
});

describe("GET /api/dashboard/owner/booking-history", () => {
  it("should return 200 and a list of past bookings for the owner's spaces", async () => {
    const res = await request(app)
      .get("/api/dashboard/owner/booking-history")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Optionally, check structure of booking objects
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("spaceId");
      expect(res.body[0]).toHaveProperty("userId");
      expect(res.body[0]).toHaveProperty("status");
    }
  });
});

describe("GET /api/dashboard/owner/spaces", () => {
  it("should return 200 and a list of spaces owned by the user", async () => {
    const res = await request(app)
      .get("/api/dashboard/owner/spaces")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Optionally, check structure of space objects
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("ownerId");
    }
  });
});

describe("GET /api/dashboard/owner/spaces/:id/bookings", () => {
  it("should return 200 and a list of bookings for a specific space", async () => {
    // First, get the list of spaces to obtain a valid space ID
    const spacesRes = await request(app)
      .get("/api/dashboard/owner/spaces")
      .set("Authorization", `Bearer ${userToken}`);
    expect(spacesRes.statusCode).toBe(200);
    const spaces = spacesRes.body;
    if (spaces.length === 0) {
      return; // No spaces to test with
    }
    const spaceId = spaces[0].id;

    // Now, get bookings for the selected space ID
    const bookingsRes = await request(app)
      .get(`/api/dashboard/owner/spaces/${spaceId}/bookings`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(bookingsRes.statusCode).toBe(200);
    expect(Array.isArray(bookingsRes.body.data)).toBe(true);
    // Optionally, check structure of booking objects
    if (bookingsRes.body.length > 0) {
      expect(bookingsRes.body[0]).toHaveProperty("id");
      expect(bookingsRes.body[0]).toHaveProperty("spaceId", spaceId);
      expect(bookingsRes.body[0]).toHaveProperty("userId");
      expect(bookingsRes.body[0]).toHaveProperty("status");
    }
  });
});

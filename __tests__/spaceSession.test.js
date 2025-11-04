import request from "supertest";
import { supabase } from "../src/lib/supabase";

let user, userToken, testData, spaceId;

beforeAll(async () => {
  userToken = global.app.access_token;
  const { data: userData } = await supabase.auth.getUser(userToken);
  user = userData.user;
  const sessions = [
    {
      day: "TUESDAY",
      startTime: "14:00",
      endTime: "16:00",
      price: "50000",
      capacity: "10",
    },
    {
      day: "WEDNESDAY",
      startTime: "14:00",
      endTime: "16:00",
      price: "50000",
      capacity: "10",
    },
  ];
  const features = { audio: true, wifi: true, projector: true, ac: true };
  const policies = ["policy 1", "policy 2", "policy 3"];

  const responseSpace = await request(global.app)
    .post("/api/space")
    .set("Authorization", "Bearer " + userToken)
    .field("name", "Space Test")
    .field("ownerId", user.id)
    .field("description", "desc")
    .field("location", "Jakarta")
    .field("features", JSON.stringify(features))
    .field("capacity", 10)
    .field("pricePerHour", 50000)
    .field("categoryId", "1f570eef-4837-495a-bb55-806f614e440f")
    .field("policies", policies)
    .field("sessions", JSON.stringify(sessions))
    .attach("images", "__tests__/img/image_1.jpg");
  spaceId = responseSpace.body.data.space.id;
});

describe("POST /api/space/sessions", () => {
  test("create space session with valid data", async () => {
    const response = await request(global.app)
      .post("/api/space/sessions")
      .set("Authorization", "Bearer " + userToken)
      .send({
        day: "TUESDAY",
        startTime: "14:00",
        endTime: "16:00",
        price: "50000",
        capacity: "10",
        notes: "no notes",
        spaceId: spaceId,
      });

    testData = response.body.data;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.spaceId).toBe(spaceId);
  });

  test("create space with invalid data", async () => {
    const response = await request(global.app)
      .post("/api/space/sessions")
      .set("Authorization", "Bearer " + userToken)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("GET /api/space/:spaceId/sessions", () => {
  test("fetch all sessions by space id", async () => {
    const response = await request(global.app)
      .get("/api/space/" + spaceId + "/sessions")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("fetch all sessions with invalid space id", async () => {
    const response = await request(global.app)
      .get("/api/space/120948/sessions")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("data not found");
  });
});

describe("GET /api/space/sessions/:id", () => {
  test("fetch space session by id", async () => {
    const response = await request(global.app)
      .get("/api/space/sessions/" + testData.id)
      .set("Authorization", "Bearer " + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id");
  });

  test("fetch space by invalid id", async () => {
    const response = await request(global.app)
      .get("/api/space/sessions/0")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

describe("DELETE /api/space/sessions/:id", () => {
  test("delete session by id", async () => {
    const response = await request(global.app)
      .delete("/api/space/sessions/" + testData.id)
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
  });

  test("delete session by invalid id", async () => {
    const response = await request(global.app)
      .delete("/api/space/sessions/0")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(500);
  });
});

afterAll(async () => {
  // Clean up: delete the created space
  await request(global.app)
    .delete("/api/space/" + spaceId)
    .set("Authorization", "Bearer " + userToken);
});
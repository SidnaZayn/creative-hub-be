import fs from "fs";
import FormData from "form-data";
import request from "supertest";
import { supabase } from "../src/lib/supabase";

let user;
let userToken;
let testData;

beforeAll(async () => {
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email: 'zidnazen@gmail.com',
  //   password: '11223344',
  // });
  // const { access_token, refresh_token } = data.session; console.log(access_token)

  userToken = global.app.access_token;
  const { data: userData } = await supabase.auth.getUser(userToken);
  user = userData.user;
});

describe("POST /api/space", () => {
  test("create space with valid data", async () => {
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

    const response = await request(global.app)
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
    testData = response.body.data.space;
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("space");
    expect(response.body.data.images).toBeInstanceOf(Array);
    expect(response.body.data.space).toHaveProperty("id");
    expect(response.body.data.space).toHaveProperty("name");
    expect(response.body.data.space).toHaveProperty("ownerId");
    expect(response.body.data.space.categoryId).toBe(
      "1f570eef-4837-495a-bb55-806f614e440f"
    );
  }, 10000);
});

describe("GET /api/space", () => {
  test("fetch all spaces", async () => {
    const response = await request(global.app)
      .get("/api/space")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("fetch data with search query", async () => {
    const response = await request(global.app)
      .get("/api/space?name=Space")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});

describe("GET /api/space/:id", () => {
  test("fetch space by id", async () => {
    const response = await request(global.app)
      .get("/api/space/" + testData.id)
      .set("Authorization", "Bearer " + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("name");
    expect(response.body.data).toHaveProperty("ownerId");
  });

  test("fetch space by invalid id", async () => {
    const response = await request(global.app)
      .get("/api/space/0")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

describe("PUT /api/space/:id", () => {
  test("update space by id", async () => {
    const response = await request(global.app)
      .put("/api/space/" + testData.id)
      .send({
        name: "Space Test Update",
        ownerId: user.id,
        description: "desc",
        city: "Jakarta",
        features: JSON.stringify({
          audio: true,
          wifi: true,
          projector: true,
          ac: true,
        }),
        capacity: 11,
        pricePerHour: 51000,
      })
      .set("Authorization", "Bearer " + userToken);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("id");
  });

  test("update space by invalid id", async () => {
    const response = await request(global.app)
      .put("/api/space/0")
      .send({
        name: "Space Test Update",
        ownerId: user.id,
        description: "desc",
        city: "Jakarta",
        features: JSON.stringify({
          audio: true,
          wifi: true,
          projector: true,
          ac: true,
        }),
        capacity: 11,
        pricePerHour: 51000,
      })
      .set("Authorization", "Bearer " + userToken);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

describe("DELETE /api/space/:id", () => {
  test("delete space by id and delete images", async () => {
    const response = await request(global.app)
      .delete("/api/space/" + testData.id)
      .set("Authorization", "Bearer " + userToken);
    const images = await request(global.app)
      .get("/api/space/" + testData.id + "/images")
      .set("Authorization", "Bearer " + userToken);
    expect(images.body.data).toBe(undefined);
    expect(response.body.message).toBe("success delete data");
    expect(response.status).toBe(200);
  });

  test("delete space by invalid id", async () => {
    const response = await request(global.app)
      .delete("/api/space/0")
      .set("Authorization", "Bearer " + userToken);
    expect(response.status).toBe(500);
  });
});

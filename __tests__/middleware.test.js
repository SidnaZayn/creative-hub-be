import request from "supertest";
import jwt from "jsonwebtoken";

describe("Protected Routes", () => {
  test("should allow access with a valid token", async () => {
    let access_token = global.app.access_token;

    const res = await request(global.app)
      .get("/protected-route")
      .set("Authorization", "Bearer " + access_token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Success" });
  });

  test("should deny access with a missing token", async () => {
    const res = await request(global.app).get("/protected-route");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Token missing");
  });

  test("should deny access with an expired token", async () => {
    const expiredToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: "-1h" });
    const res = await request(global.app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid token or expired token");
  });
});

// test for RBAC middleware with available email and passord in global.app
describe("RBAC Middleware", () => {
  let adminToken, userToken, ownerToken;
  beforeAll(async () => {
    adminToken = global.app.admin_token;
    userToken = global.app.user_token; 
    ownerToken = global.app.owner_token;
  });

  test("should allow access to ADMIN role", async () => {
    const res = await request(global.app)
      .get("/admin-protected-route")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Admin Access Granted" });
  });
  test("should deny access to non-ADMIN role", async () => {
    const res = await request(global.app)
      .get("/admin-protected-route")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Forbidden: insufficient role");
  });

  // test for user role
  test("should allow access to USER role", async () => {
    const res = await request(global.app)
      .get("/user-protected-route")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "User Access Granted" });
  });
  test("should deny access to non-USER role", async () => {
    const res = await request(global.app)
      .get("/user-protected-route")
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(403); 
    expect(res.body.error).toBe("Forbidden: insufficient role");
  });

  // test for OWNER role
  test("should allow access to OWNER role", async () => {
    const res = await request(global.app)
      .get("/owner-protected-route")
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Owner Access Granted" });
  });
  test("should deny access to non-OWNER role", async () => {
    const res = await request(global.app)
      .get("/owner-protected-route")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe("Forbidden: insufficient role");
  });
});

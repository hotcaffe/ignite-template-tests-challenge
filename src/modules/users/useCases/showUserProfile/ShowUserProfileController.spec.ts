import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

describe("Show User Profile Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show user profile with authenticated token", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Raphael Fusco",
      email: "raphaelfusco@gmail.com",
      password: "senhateste",
    });

    const { body } = await request(app).post("/api/v1/sessions").send({
      email: "raphaelfusco@gmail.com",
      password: "senhateste",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", "Token " + body.token);

    expect(response.body).toHaveProperty("id");
  });
});

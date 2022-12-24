import { app } from "../../../../app";
import { Connection, createConnection } from "typeorm";
import request from "supertest";

describe("Create User Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Raphael Fusco",
      email: "raphaelfusco@gmail.com",
      password: "senhateste",
    });

    expect(response.status).toBe(201);
  });
});

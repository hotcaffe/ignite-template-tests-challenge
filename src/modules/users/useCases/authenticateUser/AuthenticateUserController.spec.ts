import request from "supertest";
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app";

describe("Authenticate User Controller", () => {

  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user with email and password", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Raphael Fusco",
      email: "raphaelfusco@gmail.com",
      password: "senhateste"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "raphaelfusco@gmail.com",
      password: "senhateste"
    })

    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  })
})

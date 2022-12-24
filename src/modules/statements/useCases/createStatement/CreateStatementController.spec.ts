import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

interface UserSessionInterface {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

interface StatementInterface {
  id: string;
  amount: number;
  description: string;
  type: string;
  created_at: Date;
  updated_at: Date;
}

describe("Create Statement Controller", () => {
  let connection: Connection;
  let user: UserSessionInterface;
  let depositStatement: StatementInterface;
  let withdrawStatement: StatementInterface;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Raphael Fusco",
      email: "raphaelfusco@gmail.com",
      password: "senhateste",
    });

    user = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "raphaelfusco@gmail.com",
        password: "senhateste",
      })
      .then((response) => response.body);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to deposit", async () => {
    depositStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .set("Authorization", "Token " + user.token)
      .send({
        amount: 500,
        description: "deposit",
      })
      .then((response) => response.body);

    expect(depositStatement).toHaveProperty("id");
  });

  it("Should be able to withdraw", async () => {
    withdrawStatement = await request(app)
      .post("/api/v1/statements/withdraw")
      .set("Authorization", "Token " + user.token)
      .send({
        amount: 200,
        description: "withdraw",
      })
      .then((response) => response.body);

    expect(withdrawStatement).toHaveProperty("id");
  });

  it("Should be able to get user balance", async () => {
    const balanceStatement = await request(app)
      .get("/api/v1/statements/balance")
      .set("Authorization", "Token " + user.token)
      .then((response) => response.body);

    const balanceCalculated =
      depositStatement.amount - withdrawStatement.amount;

    expect(balanceStatement).toHaveProperty("balance");
    expect(balanceStatement.balance).toBe(balanceCalculated);
  });

  it("Should be able to get statement by id", async () => {
    const depositStetamentSearched = await request(app)
      .get(`/api/v1/statements/${depositStatement.id}`)
      .set("Authorization", "Token " + user.token)
      .then((response) => response.body);

    expect(depositStetamentSearched.id).toBe(depositStatement.id);

    const withdrawStetamentSearched = await request(app)
    .get(`/api/v1/statements/${withdrawStatement.id}`)
    .set("Authorization", "Token " + user.token)
    .then((response) => response.body);

    expect(withdrawStetamentSearched.id).toBe(withdrawStatement.id);
  });
});

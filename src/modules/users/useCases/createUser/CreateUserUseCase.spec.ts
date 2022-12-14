import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able to create a user", async () => {
      const userData = {
        name: "Raphael Fusco",
        email: "raphaelfusco@gmail.com",
        password: "Senha"
      }

      await createUserUseCase.execute(userData);

      const userCreated = await userRepositoryInMemory.findByEmail(userData.email);

      expect(userCreated).toHaveProperty("id");
    });
})

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeAll(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);

    const userData = {
      name: "Raphael Fusco",
      email: "raphaelfusco@gmail.com",
      password: "Senha"
    };

    await createUserUseCase.execute(userData);
  });

  it("Should be able to authenticate user", async () => {
    const userLogin = {
      email: "raphaelfusco@gmail.com",
      password: "Senha"
    };

    const jwt = await authenticateUserUseCase.execute(userLogin);

    expect(jwt).toHaveProperty("token");
  })

  it("Should not be able to authenticate a non existent user", async () => {
    const userLogin = {
      email: "teste@gmail.com",
      password: "senhainvalida"
    };

    try{
      await authenticateUserUseCase.execute(userLogin);
    } catch(error) {
      expect(error).toBeInstanceOf(AppError);
    }
  })

  it("Should not be able to authenticate a user with incorret password", async () => {
    const userLogin = {
      email: "raphaelfusco@gmail.com",
      password: "senhainvalida"
    };

    try{
      await authenticateUserUseCase.execute(userLogin);
    } catch(error) {
      expect(error).toBeInstanceOf(AppError);
    }
  })
})

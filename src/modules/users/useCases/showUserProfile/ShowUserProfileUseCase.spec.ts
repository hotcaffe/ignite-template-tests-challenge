import { verify } from "jsonwebtoken";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import authConfig from '../../../../config/auth';
import { AppError } from "../../../../shared/errors/AppError";

interface IPayLoad {
  sub: string;
}

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeAll(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);

    const userData = {
      name: "Raphael Fusco",
      email: "raphaelfusco@gmail.com",
      password: "Senha"
    };

    await createUserUseCase.execute(userData);
  });

  it("Should be able to find user informations by authentication", async () => {
    const userLogin = {
      email: "raphaelfusco@gmail.com",
      password: "Senha"
    };

    const jwt = await authenticateUserUseCase.execute(userLogin);

    const {sub: user_id} = verify(jwt.token, authConfig.jwt.secret) as IPayLoad;

    const userProfile = await showUserProfileUseCase.execute(user_id);

    expect(userProfile).toHaveProperty("id");
  });

  it("Should not be able to find an inexistent user", async () => {
    const userLogin = {
      email: "invalido@teste.com",
      password: "Senha"
    };

    try {
      await authenticateUserUseCase.execute(userLogin);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
    }

  })
})

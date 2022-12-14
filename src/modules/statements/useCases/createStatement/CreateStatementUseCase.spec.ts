import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

interface IPayLoad {
  id: string;
}

const userSingIn = {
  name: "Raphael Fusco",
  email: "raphaelfusco@gmail.com",
  password: "SenhaTeste"
};

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Create Statement", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, userRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementRepositoryInMemory);
  });

  it("Should be able to deposit an amount", async () => {
    const {id: user_id} = await createUserUseCase.execute(userSingIn) as IPayLoad;

    const depositStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'deposit' as OperationType,
      amount: 100,
      description: "Deposito teste"
    };

    await createStatementUseCase.execute(depositStatement);

    const account = await getBalanceUseCase.execute({user_id});

    expect(account.balance).toBe(100);
  });

  it("Should be able to withdraw an amount", async () => {
    const {id: user_id} = await createUserUseCase.execute(userSingIn) as IPayLoad;

    const depositStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'deposit' as OperationType,
      amount: 100,
      description: "Deposito teste"
    };

    await createStatementUseCase.execute(depositStatement);

    const withdrawStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'withdraw' as OperationType,
      amount: 50,
      description: "Saque teste"
    };

    await createStatementUseCase.execute(withdrawStatement);

    const account = await getBalanceUseCase.execute({user_id});

    expect(account.balance).toBe(50);
  });

  it("Should not be able to deposit with inexitent user", async () => {
    const depositStatement: ICreateStatementDTO = {
      user_id: "teste",
      type: 'deposit' as OperationType,
      amount: 100,
      description: "Deposito teste"
    };

    try {
      await createStatementUseCase.execute(depositStatement);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    };
  });

  it("Should not be able to withdraw with inexitent user", async () => {
    const withdrawStatement: ICreateStatementDTO = {
      user_id: "teste",
      type: 'withdraw' as OperationType,
      amount: 50,
      description: "Saque teste"
    };

    try {
      await createStatementUseCase.execute(withdrawStatement);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    };
  });

  it("Should not be able to withdraw with insufficient funds", async () => {
    const {id: user_id} = await createUserUseCase.execute(userSingIn) as IPayLoad;

    const depositStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'deposit' as OperationType,
      amount: 100,
      description: "Deposito teste"
    };

    await createStatementUseCase.execute(depositStatement);

    const withdrawStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'withdraw' as OperationType,
      amount: 200,
      description: "Saque teste"
    };

    try {
      await createStatementUseCase.execute(withdrawStatement);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
    };
  });

  it("Should be able to retrieve a finished statement", async () => {
    const {id: user_id} = await createUserUseCase.execute(userSingIn) as IPayLoad;

    const depositStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'deposit' as OperationType,
      amount: 100,
      description: "Deposito teste"
    };

    const {id: statement_id} = await createStatementUseCase.execute(depositStatement) as IPayLoad;

    const statementOperation = await getStatementOperationUseCase.execute({user_id, statement_id});

    expect(statementOperation).toHaveProperty("id");
  });

  it("Should be able to get an user balance", async () => {
    const {id: user_id} = await createUserUseCase.execute(userSingIn) as IPayLoad;

    const depositStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'deposit' as OperationType,
      amount: 100,
      description: "Deposito teste"
    };

    await createStatementUseCase.execute(depositStatement);

    const withdrawStatement: ICreateStatementDTO = {
      user_id: user_id,
      type: 'withdraw' as OperationType,
      amount: 70,
      description: "Saque teste"
    };

    await createStatementUseCase.execute(withdrawStatement);

    const account = await getBalanceUseCase.execute({user_id});

    expect(account.balance).toBe(30);
  });
});

import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFERS = "transfers",
}

export class CreateTransfersStatementController {
  async execute(request: Request, response: Response) {
    const { user_id } = request.params;
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const type = "transfers" as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}

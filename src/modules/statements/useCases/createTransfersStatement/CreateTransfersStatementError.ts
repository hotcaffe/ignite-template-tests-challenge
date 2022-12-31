import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransfersStatementError {
  export class SenderNotFound extends AppError {
    constructor() {
      super("Sender user not found", 404);
    }
  }
}

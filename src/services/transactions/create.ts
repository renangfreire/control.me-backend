import { UsersRepository } from "@/core/repositories/user-repository";
import { createTransactionRequestSchema } from "../../core/services/transactions/transactions";

export class CreateUserService{
    constructor(
        private userRepository: UsersRepository
    ){}

    async handle({categoryId, formPaymentId, monthTransaction, transactionType, transaction_at, userId, value}: createTransactionRequestSchema){
    }
}
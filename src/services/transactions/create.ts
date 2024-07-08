import { UsersRepository } from "@/repositories/@types/user-repository";
import { createTransactionRequestSchema } from "./@types/transactions";

export class CreateUserService{
    constructor(
        private userRepository: UsersRepository
    ){}

    async handle({categoryId, formPaymentId, monthTransaction, transactionType, transaction_at, userId, value}: createTransactionRequestSchema){
    }
}
import { UsersRepository } from "@/core/repositories/user-repository";
import { createTransactionRequestSchema } from "../../core/services/transactions/transactions";
import { CategoryRepository } from "@/core/repositories/category-repository";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";
import { FormPaymentNotExists } from "@/main/errors/FormPaymentNotExists";
import { TransactionRepository } from "@/core/repositories/transactions-repository";

export class CreateTransactionService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository,
        private formPaymentRepository: FormPaymentRepository,
        private transactionRepository: TransactionRepository
    ){}

    async handle({category_id, formPayment_id, monthTransaction, transaction_type, transaction_at, user_id, value}: createTransactionRequestSchema){
        const user = await this.userRepository.findById(user_id)

        if(!user){
            throw badRequest(new ResourcesNotFound())
        }

        if(category_id){
            const category = await this.categoryRepository.findById(category_id)

            if(!category){
                throw badRequest(new CategoryNotExists())
            }
        }

        if(formPayment_id){
            const formPayment = await this.formPaymentRepository.findById(formPayment_id)

            if(!formPayment){
                throw badRequest(new FormPaymentNotExists())
            }
        }

        const transaction = await this.transactionRepository.create({
            monthTransaction,
            transaction_type,
            user_id,
            value,
            category_id,
            formPayment_id,
            transaction_at
        })

        return {
            transaction
        }


    }
}
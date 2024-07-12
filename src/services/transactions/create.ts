import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryRepository } from "@/core/repositories/category-repository";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";
import { FormPaymentNotExists } from "@/main/errors/FormPaymentNotExists";
import { TransactionRepository } from "@/core/repositories/transactions-repository";

import { $Enums, Invoice, Prisma } from "@prisma/client"
import dayjs from "dayjs";
export interface createTransactionRequestSchema {
    user_id: string,
    value: number,
    transaction_at: string,
    transaction_type: $Enums.TrasactionType
    monthTransaction: $Enums.Months
    category_id?: string | null,
    formPayment_id?: string | null
    installments: number
}

interface invoice {
    value: number,
    monthTransaction: $Enums.Months
}

export class CreateTransactionService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository,
        private formPaymentRepository: FormPaymentRepository,
        private transactionRepository: TransactionRepository
    ){}

    async handle({category_id, formPayment_id, monthTransaction, transaction_type, transaction_at, user_id, value, installments}: createTransactionRequestSchema){
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

        
        let dataInvoices: invoice[] = []
        for(let i = 0; i < installments; i++){
            const dayjsMonthTransaction = dayjs(`2024 ${monthTransaction} 01`, "YYYY MMMM DD")
            const updatedDateTransaction = dayjsMonthTransaction.add(i, "month")

            const monthName = updatedDateTransaction.format("MMMM").toUpperCase() as $Enums.Months

            const invoice = {
                value: value / installments,
                monthTransaction: monthName
            }

            dataInvoices.push(invoice)
        }

        const { transaction, invoices } = await this.transactionRepository.create({
            transaction_type,
            user_id,
            category_id,
            formPayment_id,
            transaction_at,
            Invoices: {
                createMany: {
                    data: dataInvoices
                }
            }
        })

        return {
            transaction,
            invoices
        }
    }
}
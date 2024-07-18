import { ExpenseRepository } from "@/core/repositories/expenses-repository"
import { InvoiceRepository } from "@/core/repositories/invoice-repository"
import { UsersRepository } from "@/core/repositories/user-repository"
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound"
import { badRequest } from "@/main/helpers"
import { $Enums } from "@prisma/client"

interface updateIncomeRequestSchema {
    id: string,
    user_id: string,
    value?: number,
    transaction_at?: string,
    transaction_type?: $Enums.TrasactionType
    monthTransaction?: $Enums.Months
    category_id?: string | null,
    formPayment_id?: string | null
    installments?: number
}


export class updateIncomeService{
    constructor(
        private userRepository: UsersRepository,
        private expenseRepository: ExpenseRepository,
        private invoiceRepository: InvoiceRepository
    ){}

    async handle(data: updateIncomeRequestSchema){
        const [user, expense] =  await Promise.all([
            this.userRepository.findById(data.user_id),
            this.expenseRepository.findById(data.id)
        ])

        if(!user || !expense){
            throw badRequest(new ResourcesNotFound())
        }
    }
}
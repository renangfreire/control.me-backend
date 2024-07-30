import { ExpenseRepository } from "@/core/repositories/expenses-repository"
import { InvoiceRepository } from "@/core/repositories/invoice-repository"
import { UsersRepository } from "@/core/repositories/user-repository"
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound"
import { badRequest } from "@/main/helpers"
import { $Enums } from "@prisma/client"

interface updateInvoiceRequestSchema {
    id: string,
    user_id: string,
    value?: number,
    monthTransaction?: $Enums.Months
}


export class updateInvoiceService{
    constructor(
        private userRepository: UsersRepository,
        private expenseRepository: ExpenseRepository,
        private invoiceRepository: InvoiceRepository
    ){}

    async handle(data: updateInvoiceRequestSchema){
        const [user, expense] =  await Promise.all([
            this.userRepository.findById(data.user_id),
            this.expenseRepository.findById(data.id)
        ])

        if(!user || !expense){
            throw badRequest(new ResourcesNotFound())
        }
    }
}
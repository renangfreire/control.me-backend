import { CategoryRepository } from "@/core/repositories/category-repository"
import { ExpenseRepository } from "@/core/repositories/expenses-repository"
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository"
import { UsersRepository } from "@/core/repositories/user-repository"
import { prisma } from "@/main/config/prisma"
import { CategoryNotExists } from "@/main/errors/CategoryNotExists"
import { FormPaymentNotExists } from "@/main/errors/FormPaymentNotExists"
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound"
import { badRequest } from "@/main/helpers"
import { $Enums, Expense, Invoice } from "@prisma/client"
import { CreateUserService } from "../user/create"
import { InvoiceRepository } from "@/core/repositories/invoice-repository"
import dayjs from "dayjs"
import { mergeObject } from "@/main/helpers/HelpMethods"

interface updateExpenseRequestSchema {
    id: string,
    user_id: string,
    value?: number,
    transaction_at?: string,
    transaction_type?: $Enums.TrasactionType
    monthTransaction?: $Enums.Months
    category_id?: string | null,
    formPayment_id?: string | null
    installments: number
}

interface invoice {
    expense_id: string,
    value: number,
    monthTransaction: $Enums.Months
}


export class UpdateExpenseService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository,
        private formPaymentRepository: FormPaymentRepository,
        private expenseRepository: ExpenseRepository,
        private invoiceRepository: InvoiceRepository
    ){}

    async handle({id, user_id, category_id, formPayment_id, installments, monthTransaction, transaction_at, transaction_type, value}: updateExpenseRequestSchema){
        let updatedInvoices: Invoice[] = []
        
        const [user, expense] = await Promise.all([
            this.userRepository.findById(user_id),
            this.expenseRepository.findByIdIncludeInvoice(id)
        ])

        if(!user || !expense){
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

        const isSameMonthTransaction = expense.Invoices.at(0)?.monthTransaction !== monthTransaction

        if(value && (installments !== expense.Invoices.length || !isSameMonthTransaction)){
            await this.invoiceRepository.deleteMany({
                expense_id: id
            })

            let dataInvoices: invoice[] = []
            for(let i = 0; i < installments; i++){
                const dayjsMonthTransaction = dayjs(`2024 ${monthTransaction} 01`, "YYYY MMMM DD")
                const updatedDateTransaction = dayjsMonthTransaction.add(i, "month")
    
                const monthName = updatedDateTransaction.format("MMMM").toUpperCase() as $Enums.Months
    
                const invoice = {
                    expense_id: id,
                    value: value / installments,
                    monthTransaction: monthName,
                }
    
                dataInvoices.push(invoice)
            }

            updatedInvoices = await this.invoiceRepository.createMany(dataInvoices)
        }
        
        const invoicesSum = await this.expenseRepository.getSumTotalValue(id)
        if(value && value !== invoicesSum.totalValue){
            const newestValueToInvoices = value / installments
            await this.invoiceRepository.updateMany({
                expense_id: id,
            }, {
                value: newestValueToInvoices
            })
        }

        const bodyData = {
            category_id,
            formPayment_id,
            transaction_at,
        }

        const {Invoices, ...dataToUpdate} = mergeObject(expense, bodyData)
        await this.expenseRepository.update(dataToUpdate as Expense)

        const updatedExpense = await this.expenseRepository.findByIdIncludeInvoice(id)

        return {
            expense: updatedExpense,
            invoices: updatedInvoices
        }
    }
}
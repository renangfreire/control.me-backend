import { ExpenseRepository, ExpenseWithInvoice } from "@/core/repositories/expenses-repository";
import { Expense, Invoice, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

interface inMemoryDataBase {
    Expenses: Expense[],
    Invoices: Invoice[]
}

export class InMemoryExpenseRepository implements ExpenseRepository {
    private db: inMemoryDataBase = {
        Expenses: [],
        Invoices: []
    }

    async create(data: Prisma.ExpenseUncheckedCreateInput) {
        const invoiceData = data.Invoices?.createMany?.data || []
        const arrInvoices = Array.isArray(invoiceData) ? invoiceData : [invoiceData]

        const expense = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),

            transaction_at: data.transaction_at ? new Date(data.transaction_at) : null,
            formPayment_id: data.formPayment_id || null,
            category_id: data.category_id || null,
        }

        const invoices = arrInvoices.map((data) => {
            return {
                ...data,
                id: randomUUID(),
                created_at: new Date(),
                value: new Prisma.Decimal(data && Number(data.value)),
                expense_id: expense.id,
            }
        })

        this.db.Invoices = [...this.db.Invoices, ...invoices]

        this.db.Expenses.push(expense)

        return {
            expense,
            invoices: invoices
        }
    }

    async findById(expense_id: string): Promise<Expense | null> {
        const expense = this.db.Expenses.find(value => value.id === expense_id)

        return expense || null
    }

    async getSumTotalValue(expense_id: any): Promise<{ totalValue: number; }> {
        const totalValue = this.db.Invoices.reduce((acc: number, invoice) => {
            if(invoice.expense_id === expense_id){
                acc+= invoice.value instanceof Prisma.Decimal ? invoice.value.toNumber() : Number(invoice.value)
            }

            return acc
        }, 0)

        return {
            totalValue
        }
    }

    async findByIdIncludeInvoice(expense_id: string): Promise<ExpenseWithInvoice | null> {
        const expense = this.db.Expenses.find(value => value.id === expense_id)
        const invoices = this.db.Invoices.reduce((acc: Invoice[], invoice) => {
            if(invoice.expense_id === expense_id){
                acc.push(invoice)
            }

            return acc
        }, [])

        return expense ? {
            ...expense,
            Invoices: invoices
         }
         : null
    }

    async update(data: Expense): Promise<Expense | null> {
        const expenseIndex = this.db.Expenses.findIndex(expense => data.id === expense.id)
    
        if(!expenseIndex){
            return null
        }

        this.db.Expenses[expenseIndex] = data

        return data || null
    }

}
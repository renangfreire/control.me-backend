import { ExpenseRepository } from "@/core/repositories/expenses-repository";
import { Expense, Invoice, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

interface inMemoryDataBase {
    Expenses: Expense[],
    Invoices: Invoice[]
}

export class InMemoryExpenseRepository implements ExpenseRepository{
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
}
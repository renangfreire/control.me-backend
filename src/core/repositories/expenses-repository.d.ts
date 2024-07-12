import { Prisma, Invoice, Expense } from "@prisma/client";
export class ExpenseRepository{
    async create(data: Prisma.ExpenseUncheckedCreateInput): Promise<{
        expense: Expense,
        invoices: Invoices[]
    }>
}
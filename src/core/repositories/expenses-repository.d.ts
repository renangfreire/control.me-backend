import { Prisma, Invoice, Expense } from "@prisma/client";

const expenseWithInvoice = Prisma.validator<Prisma.ExpenseDefaultArgs>()({
    include: { Invoices: true },
  })

type ExpenseWithInvoice = Prisma.ExpenseGetPayload<typeof expenseWithInvoice>
export class ExpenseRepository{
    async create(data: Prisma.ExpenseUncheckedCreateInput): Promise<{
        expense: Expense,
        invoices: Invoices[]
    }>
    async findById(expense_id: string) : Promise<Expense | null>   
    async findByIdIncludeInvoice(expense_id: string) : Promise<ExpenseWithInvoice | null>
    async getSumTotalValue(expense_id) : Promise<{totalValue: number}>
    async update(data: Expense) : Promise<Expense | null>
}
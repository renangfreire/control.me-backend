import { Prisma, Transaction, Invoice } from "@prisma/client";
export class TransactionRepository{
    async create(data: Prisma.TransactionUncheckedCreateInput): Promise<{
        transaction: Transaction,
        invoices: Invoices[]
    }>
}
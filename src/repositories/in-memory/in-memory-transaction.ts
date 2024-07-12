import { TransactionRepository } from "@/core/repositories/transactions-repository";
import { prisma } from "@/main/config/prisma";
import { Invoice, Prisma, Transaction } from "@prisma/client";
import { randomUUID } from "crypto";

interface inMemoryDataBase {
    Transactions: Transaction[],
    Invoices: Invoice[]
}

export class InMemoryTransactionRepository implements TransactionRepository{
    private db: inMemoryDataBase = {
        Transactions: [],
        Invoices: []
    }

    async create(data: Prisma.TransactionUncheckedCreateInput) {
        const invoiceData = data.Invoices?.createMany?.data
        const arrInvoices = Array.isArray(invoiceData) ? invoiceData : (invoiceData && [invoiceData])

        const transaction = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),

            transaction_at: data.transaction_at ? new Date(data.transaction_at) : null,
            formPayment_id: data.formPayment_id || null,
            category_id: data.category_id || null,
        }

        const invoices = arrInvoices?.map((data) => {
            return {
                ...data,
                id: randomUUID(),
                created_at: new Date(),
                value: new Prisma.Decimal(data && Number(data.value)),
                transaction_id: transaction.id,
            }
        })

        if(invoices){
            this.db.Invoices = [...this.db.Invoices, ...invoices]
        }

        this.db.Transactions.push(transaction)

        return {
            transaction: transaction,
            invoices: this.db.Invoices
        }
    }
}
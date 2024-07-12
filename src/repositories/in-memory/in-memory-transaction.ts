import { TransactionRepository } from "@/core/repositories/transactions-repository";
import { Prisma, Transaction } from "@prisma/client";
import { randomUUID } from "crypto";

interface inMemoryDataBase {
    Transactions: Transaction[]
}

export class InMemoryTransactionRepository implements TransactionRepository{
    private db: inMemoryDataBase = {
        Transactions: []
    }

    async create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
        const transaction = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),
            value: new Prisma.Decimal(data.value && Number(data.value)),
            transaction_at: data.transaction_at ? new Date(data.transaction_at) : null,
            formPayment_id: data.formPayment_id || null,
            category_id: data.category_id || null
        }

        this.db.Transactions.push(transaction)

        return transaction
    }
}
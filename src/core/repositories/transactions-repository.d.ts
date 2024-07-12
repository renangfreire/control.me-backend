import { Prisma, Transaction } from "@prisma/client";

export class TransactionRepository{
    async create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
}
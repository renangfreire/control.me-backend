import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { Prisma, Revenue } from "@prisma/client";
import { randomUUID } from "crypto";

interface inMemoryDataBase {
    Revenue: Revenue[]
}

export class InMemoryRevenueRepository implements RevenueRepository{
    private db: inMemoryDataBase = {
        Revenue: []
    }

    async create(data: Prisma.RevenueUncheckedCreateInput) {
        const revenue = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),

            transaction_at: (data.transaction_at && new Date(data.transaction_at)) || null,
            value: new Prisma.Decimal(data.value && Number(data.value)),
            category_id: data.category_id || null
        }

        this.db.Revenue.push(revenue)

        return revenue
    }
}
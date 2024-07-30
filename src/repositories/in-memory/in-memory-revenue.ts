import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { prisma } from "@/main/config/prisma";
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

    async findById(id: String): Promise<Revenue | null> {
        const revenue = this.db.Revenue.find(value => value.id === id)

        return revenue || null
    }

    async update(data: Revenue): Promise<Revenue> {
        const revenueIndex = this.db.Revenue.findIndex(value => value.id === data.id)

        if(revenueIndex){
            this.db.Revenue.splice(revenueIndex, 1)

            this.db.Revenue.push(data)
        }

        return data
    }

    async delete(id: String): Promise<Revenue> {
        const revenueIndex = this.db.Revenue.findIndex(value => value.id === id)

        const [ data ] = this.db.Revenue.splice(revenueIndex, 1)

        return data
    }
}
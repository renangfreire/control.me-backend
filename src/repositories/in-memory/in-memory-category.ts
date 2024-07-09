import { Category, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { CategoryRepository } from "@/core/repositories/category-repository";

interface inMemoryDatabase {
    Category: Category[]
}

export class InMemoryCategoryRepository implements CategoryRepository{
    #db: inMemoryDatabase = {
        Category: []
    }

    async create(data: Prisma.CategoryUncheckedCreateInput){
        const categoryData = {
            ...data,
            id: randomUUID(),
            transaction_type: data.transaction_type || null,
            created_at: new Date(),
        }

        this.#db.Category.push(categoryData)

        return categoryData
    }

}
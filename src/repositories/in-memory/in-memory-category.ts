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

    async update(data: Category): Promise<Category> {
        const categoryIndex = this.#db.Category.findIndex((category) => category.id === data.id)

        if(categoryIndex > 0) {
            this.#db.Category[categoryIndex] = data
        }

        return data
    }

    async findById(category_id: string): Promise<Category | null> {
        const category = this.#db.Category.find((category) => category_id === category.id)

        return category || null
    }

    async delete(category_id: string): Promise<Boolean> {
        const categoryIndex = this.#db.Category.findIndex(category => category.id === category_id)

        if(categoryIndex > 0){
            this.#db.Category.splice(categoryIndex, 1)

            return true
        }

        return false
    }

}
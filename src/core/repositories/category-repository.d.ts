import { Category, Prisma } from "@prisma/client";
export interface CategoryRepository{
    async create(data: Prisma.CategoryUncheckedCreateInput) : Promise<Category>
    async update(data: Category) : Promise<Category>
    async delete(category_id: string): Promise<Boolean>
    async findById(category_id: string) : Promise<Category | null>
}
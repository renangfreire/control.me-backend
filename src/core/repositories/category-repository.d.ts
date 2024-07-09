import { Category, Prisma } from "@prisma/client";

export interface CategoryRepository{
    async create(data: Prisma.CategoryUncheckedCreateInput) : Promise<Category>
}
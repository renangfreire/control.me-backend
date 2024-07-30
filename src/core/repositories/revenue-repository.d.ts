import { Prisma, Revenue } from "@prisma/client";
export class RevenueRepository{
    async create(data: Prisma.RevenueUncheckedCreateInput): Promise<Revenue>
    async update(data: Revenue) : Promise<Revenue>
    async findById(id: String): Promise<Revenue | null>
    async delete(id: String): Promise<Revenue>
}
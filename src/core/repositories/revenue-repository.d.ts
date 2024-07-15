import { Prisma, Revenue } from "@prisma/client";
export class RevenueRepository{
    async create(data: Prisma.RevenueUncheckedCreateInput): Promise<Revenue>
}
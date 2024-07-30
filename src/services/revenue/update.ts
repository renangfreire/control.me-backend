import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryRepository } from "@/core/repositories/category-repository";
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";

import { $Enums, Prisma } from "@prisma/client"
import { RevenueRepository } from "@/core/repositories/revenue-repository";
export interface updateRevenueRequestSchema {
    id: string,
    user_id: string,
    value: number,
    transaction_at: string,
    monthTransaction: $Enums.Months
    category_id?: string | null,
}

export class UpdateRevenueService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository,
        private revenueRepository: RevenueRepository
    ){}

    async handle({id, category_id, transaction_at, monthTransaction, user_id, value}: updateRevenueRequestSchema){
        const [user, existentRevenue] = await Promise.all([
            this.userRepository.findById(user_id),
            this.revenueRepository.findById(id)
        ])

        if(!user || !existentRevenue){
            throw badRequest(new ResourcesNotFound())
        }

        if(category_id){
            const category = await this.categoryRepository.findById(category_id)

            if(!category){
                throw badRequest(new CategoryNotExists())
            }
        }

        const dataToUpdate = {
            ...existentRevenue,
            category_id: category_id || null,
            transaction_at: new Date(transaction_at),
            monthTransaction,
            value: new Prisma.Decimal(value),
        }

        const revenue = await this.revenueRepository.update(dataToUpdate)

        return {
            revenue
        }
    }
}
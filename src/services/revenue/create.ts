import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryRepository } from "@/core/repositories/category-repository";
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";

import { $Enums } from "@prisma/client"
import { RevenueRepository } from "@/core/repositories/revenue-repository";
export interface createExpenseRequestSchema {
    user_id: string,
    value: number,
    transaction_at: string,
    monthTransaction: $Enums.Months
    category_id?: string | null,
}

export class CreateRevenueService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository,
        private revenueRepository: RevenueRepository
    ){}

    async handle({category_id, transaction_at, monthTransaction, user_id, value}: createExpenseRequestSchema){
        const user = await this.userRepository.findById(user_id)

        if(!user){
            throw badRequest(new ResourcesNotFound())
        }

        if(category_id){
            const category = await this.categoryRepository.findById(category_id)

            if(!category){
                throw badRequest(new CategoryNotExists())
            }
        }

        const revenue = await this.revenueRepository.create({
            user_id,
            category_id,
            transaction_at,
            monthTransaction,
            value,
        })

        return {
            revenue
        }
    }
}
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { UsersRepository } from "@/core/repositories/user-repository";
import { transactionType } from "@/core/services/transactions/transactions";
import { CategoryRepository } from "@/core/repositories/category-repository";

interface createCategoryRequestSchema {
    name: string,
    transaction_type: transactionType,
    user_id: string
}

export class CategoryService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository
    ){}

    async handle({name, transaction_type, user_id}: createCategoryRequestSchema){
        const user = await this.userRepository.findById(user_id)

        if(!user){
            throw badRequest(new ResourcesNotFound())
        }

        const category = await this.categoryRepository.create({
            name, 
            transaction_type,
            user_id
        })

        return {
            category
        }

    }
}
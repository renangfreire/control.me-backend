import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryRepository } from "@/core/repositories/category-repository";
import { transactionType } from "@/core/services/transactions/transactions";

interface updateCategoryRequestSchema {
    id: string,
    name?: string | null,
    transaction_type?: transactionType | null,
    user_id: string
}

export class UpdateCategoryService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository
    ){}

    async handle({id, name, transaction_type, user_id}: updateCategoryRequestSchema){
        const [ user, existentCategory ] = await Promise.all([
            this.userRepository.findById(user_id), 
            this.categoryRepository.findById(id)
        ])

        if(!user || !existentCategory){
            throw badRequest(new ResourcesNotFound())
        }

        if(existentCategory.user_id !== user.id){
            throw badRequest(new ResourcesNotFound())
        }

        const category = await this.categoryRepository.update({
            ...existentCategory,
            name: name || existentCategory.name,
            transaction_type: transaction_type || existentCategory.transaction_type,
        })

        return {
            category
        }

    }
}
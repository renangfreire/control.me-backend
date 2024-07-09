import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryRepository } from "@/core/repositories/category-repository";

interface deleteCategoryRequestSchema {
    category_id: string,
    user_id: string
}

export class DeleteCategoryService{
    constructor(
        private userRepository: UsersRepository,
        private categoryRepository: CategoryRepository
    ){}

    async handle({category_id, user_id}: deleteCategoryRequestSchema){
        const [ user, existentCategory ] = await Promise.all([
            this.userRepository.findById(user_id), 
            this.categoryRepository.findById(category_id)
        ])

        if(!user || !existentCategory){
            throw badRequest(new ResourcesNotFound())
        }

        if(existentCategory.user_id !== user.id){
            throw badRequest(new ResourcesNotFound())
        }

        await this.categoryRepository.delete(category_id)

        return {
            category: existentCategory
        }

    }
}
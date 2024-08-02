import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { badRequest } from "@/main/helpers";

interface fetchRevenuesRequestSchema {
    user_id: string,
    page: number
}

export class FetchRevenues{
    constructor(
        private userRepository: UsersRepository,
        private revenueRepository: RevenueRepository
    ){}
    
    async handle({user_id, page}: fetchRevenuesRequestSchema){
        const user = await this.userRepository.findById(user_id)
        
        if(!user){
            throw badRequest(new ResourcesNotFound())
        }

        const revenues = await this.revenueRepository.fetchByUserIdWithPage(
            page,
            user_id
        )

        return {
            revenues
        }
    }
}
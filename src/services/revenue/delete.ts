import { UsersRepository } from "@/core/repositories/user-repository";
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";

import { RevenueRepository } from "@/core/repositories/revenue-repository";
export interface deleteRevenueRequestSchema {
    id: string,
    user_id: string,
}

export class DeleteRevenueService{
    constructor(
        private userRepository: UsersRepository,
        private revenueRepository: RevenueRepository
    ){}

    async handle({id, user_id}: deleteRevenueRequestSchema){
        const [user, existentRevenue] = await Promise.all([
            this.userRepository.findById(user_id),
            this.revenueRepository.findById(id)
        ])

        if(!user || !existentRevenue){
            throw badRequest(new ResourcesNotFound())
        }

        const isNotSameUserWhoCreated = existentRevenue.user_id !== user_id

        if(isNotSameUserWhoCreated){
            throw badRequest(new ResourcesNotFound())
        }

        await this.revenueRepository.delete(id)

        return {
            revenue: existentRevenue
        }
    }
}
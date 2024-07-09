import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { UsersRepository } from "@/core/repositories/user-repository";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";

interface deleteFormPaymentRequestSchema {
    id: string,
    user_id: string
}

export class DeleteFormPaymentService{
    constructor(
        private userRepository: UsersRepository,
        private formPaymentRepository: FormPaymentRepository
    ){}

    async handle({id, user_id}: deleteFormPaymentRequestSchema){
        const [ user, existentFormPayment ] = await Promise.all([
            this.userRepository.findById(user_id), 
            this.formPaymentRepository.findById(id)
        ])

        if(!user || !existentFormPayment){
            throw badRequest(new ResourcesNotFound())
        }

        if(existentFormPayment.user_id !== user.id){
            throw badRequest(new ResourcesNotFound())
        }

        await this.formPaymentRepository.delete(id)

        return {
            formPayment: existentFormPayment
        }

    }
}
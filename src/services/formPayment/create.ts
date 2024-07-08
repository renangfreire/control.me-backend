import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";
import { UsersRepository } from "@/core/repositories/user-repository";

interface createFormPaymentRequestSchema {
    name: string,
    invoice_day?: number | null,
    due_day?: number | null,
    user_id: string
}

export class FormPaymentService{
    constructor(
        private userRepository: UsersRepository,
        private formPaymentRepository: FormPaymentRepository
    ){}

    async handle({name, due_day, invoice_day, user_id}: createFormPaymentRequestSchema){
        const user = await this.userRepository.findById(user_id)

        if(!user){
            throw badRequest(new ResourcesNotFound())
        }

        const formPayment = await this.formPaymentRepository.create({
            name, 
            due_day,
            invoice_day,
            user_id
        })

        return {
            formPayment
        }

    }
}
import { badRequest } from "@/main/helpers";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { UsersRepository } from "@/core/repositories/user-repository";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";

interface updateFormPaymentRequestSchema {
    id: string,
    name: string,
    invoice_day?: number | null,
    due_day?: number | null,
    user_id: string
}

export class UpdateFormPaymentService{
    constructor(
        private userRepository: UsersRepository,
        private formPaymentRepository: FormPaymentRepository
    ){}

    async handle({id, invoice_day, due_day, name, user_id}: updateFormPaymentRequestSchema){
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

        const formPayment = await this.formPaymentRepository.update({
            ...existentFormPayment,
            invoice_day: invoice_day || existentFormPayment.invoice_day,
            due_day: due_day || existentFormPayment.due_day,
            name,
        })

        return {
            formPayment
        }

    }
}
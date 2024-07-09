import { Prisma, formPayment } from "@prisma/client";
import { randomUUID } from "crypto";
import { FormPaymentRepository } from "../../core/repositories/form-payment-repository";

interface inMemoryDatabase {
    FormsPayment: formPayment[]
}

export class InMemoryFormPaymentRepository implements FormPaymentRepository{
    #db: inMemoryDatabase = {
        FormsPayment: []
    }

    async create(data: Prisma.formPaymentUncheckedCreateInput){
        const formPaymentData = {
            ...data,
            id: randomUUID(),
            due_day: data.due_day || null,
            invoice_day: data.invoice_day || null,
        }

        this.#db.FormsPayment.push(formPaymentData)

        return formPaymentData
    }

    async findById(formPayment_id: string): Promise<formPayment | null> {
        const formPayment =  this.#db.FormsPayment.find(value => value.id === formPayment_id)
        return formPayment || null
    }

    async update(data: formPayment): Promise<formPayment> {
        const formPaymentIndex = this.#db.FormsPayment.findIndex((formPayment) => formPayment.id === data.id)

        if(formPaymentIndex > 0) {
            this.#db.FormsPayment[formPaymentIndex] = data
        }

        return data
    }

    async delete(formPayment_id: string): Promise<Boolean> {
        const formPaymentIndex = this.#db.FormsPayment.findIndex(formPayment => formPayment.id === formPayment_id)

        if(formPaymentIndex > 0){
            this.#db.FormsPayment.splice(formPaymentIndex, 1)

            return true
        }

        return false
    }
}
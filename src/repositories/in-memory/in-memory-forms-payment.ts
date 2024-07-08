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

}
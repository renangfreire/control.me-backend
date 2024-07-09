import { Prisma, User, formPayment } from "@prisma/client";

export interface FormPaymentRepository{
    async create(data: Prisma.formPaymentUncheckedCreateInput) : Promise<formPayment>
    async findById(formPayment_id: string) : Promise<formPayment | null>
    async update(data: formPayment): Promise<formPayment>
    async delete(formPayment_id: string): Promise<Boolean>
}
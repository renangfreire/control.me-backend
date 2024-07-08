import { Prisma, User, formPayment } from "@prisma/client";

export interface FormPaymentRepository{
    async create(data: Prisma.formPaymentUncheckedCreateInput) : Promise<formPayment>
}
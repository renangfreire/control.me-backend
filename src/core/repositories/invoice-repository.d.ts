import { Invoice, Prisma } from "@prisma/client";

export interface InvoiceRepository{
   async findById(incomeId: string) : Promise<Invoice | null>
   async update(data: Invoice) : Promise<Invoice | null>
   async updateMany(dataWhere: {expense_id: string,}, updatedValue: {value: number}) : Promise<Invoice[] | null>
   async deleteMany(dataWhere: {expense_id: string})
   async createMany(invoices: Prisma.InvoiceUncheckedCreateInput[]) : Prisma<Invoice[]>
}
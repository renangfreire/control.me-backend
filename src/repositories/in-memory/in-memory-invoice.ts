import { InvoiceRepository } from "@/core/repositories/invoice-repository";
import { Expense, Invoice, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

interface inMemoryDataBase {
    Invoices: Invoice[]
}

export class InMemoryInvoiceRepository implements InvoiceRepository {
    private db: inMemoryDataBase = {
        Invoices: []
    }

    async create(data: Prisma.InvoiceUncheckedCreateInput) {
        const invoice = {
            ...data,
            id: randomUUID(),
            created_at: new Date(),
            value: new Prisma.Decimal(data && Number(data.value)),
        }

        this.db.Invoices.push(invoice)
        return {
            invoice
        }
    }

    async findById(invoice_id: string): Promise<Invoice | null> {
        const invoice = this.db.Invoices.find(value => value.id === invoice_id)

        return invoice || null
    }

    async createMany(invoices: Prisma.InvoiceUncheckedCreateInput[]) : Promise<Invoice[]> {
        const arrInvoices = Array.isArray(invoices) ? invoices : [invoices]

        const invoicesCreated = arrInvoices.map((data) => {
            return {
                ...data,
                id: randomUUID(),
                created_at: new Date(),
                value: new Prisma.Decimal(data && Number(data.value)),
            }
        })

        this.db.Invoices = [...this.db.Invoices, ...invoicesCreated]

        return invoicesCreated
    }

    async deleteMany(dataWhere: { expense_id: string; }) {
        const arrInvoicesFiltered = this.db.Invoices.filter(invoice => invoice.expense_id !== dataWhere.expense_id)

        this.db.Invoices = arrInvoicesFiltered
    }

    async update(data: Invoice): Promise<Invoice | null> {
        const expenseIndex = this.db.Invoices.findIndex(invoice => data.id === invoice.id)
    
        if(!expenseIndex){
            return null
        }

        this.db.Invoices[expenseIndex] = data

        return data || null
    }

    async updateMany(dataWhere: { expense_id: string; }, updatedValue: { value: number; }): Promise<Invoice[] | null> {
        const allInvoices = this.db.Invoices.reduce((acc: Invoice[], invoice) => {
            if(invoice.expense_id == dataWhere.expense_id){
                // Updating Invoices
                const newestInvoice = {
                    ...invoice,
                    ...updatedValue,
                    value: new Prisma.Decimal(updatedValue.value)
                }

                acc.push(newestInvoice)
                return acc
            }

            acc.push(invoice)
            return acc
        }, []) 

        this.db.Invoices = allInvoices

        return allInvoices
    }
    
}
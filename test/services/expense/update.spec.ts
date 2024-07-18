
import { CategoryRepository } from "@/core/repositories/category-repository";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";
import { ExpenseRepository } from "@/core/repositories/expenses-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryFormPaymentRepository } from "@/repositories/in-memory/in-memory-forms-payment";
import { InMemoryExpenseRepository } from "@/repositories/in-memory/in-memory-expense";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { CreateExpenseService } from "@/services/expense/create";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";
import { FormPaymentNotExists } from "@/main/errors/FormPaymentNotExists";
import { UpdateExpenseService } from "@/services/expense/update";
import { InMemoryInvoiceRepository } from "@/repositories/in-memory/in-memory-invoice";
import { InvoiceRepository } from "@/core/repositories/invoice-repository";

let userRepository: UsersRepository
let formPaymentRepository: FormPaymentRepository
let updateExpenseService: UpdateExpenseService
let categoryRepository: CategoryRepository
let expenseRepository: ExpenseRepository
let invoiceRepository: InvoiceRepository

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        formPaymentRepository = new InMemoryFormPaymentRepository()
        categoryRepository = new InMemoryCategoryRepository()
        expenseRepository = new InMemoryExpenseRepository()
        invoiceRepository = new InMemoryInvoiceRepository()
        updateExpenseService = new UpdateExpenseService(userRepository, categoryRepository, formPaymentRepository, expenseRepository, invoiceRepository)
    })

    it("should be able create an expense", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const formPayment = await formPaymentRepository.create({
            name: "Conta corrente",
            user_id: user.id
        })

        const category = await categoryRepository.create({
            user_id: user.id,
            name: "Investimento",
            transaction_type: "EXPENSE"
        })

        const {expense: expenseCreated, invoices: invoicesCreated} = await expenseRepository.create({
            user_id: user.id,
            formPayment_id: formPayment.id,
            category_id: category.id,
            transaction_at: new Date().toString(),
            Invoices: {
                 createMany: {
                    data: [
                        {
                            monthTransaction: "JULY",
                            value: 500,
                            created_at: new Date()
                        }
                    ]
                 }
            }
        })

        const { expense, invoices} = await updateExpenseService.handle({
            id: expenseCreated.id,
            user_id: user.id,
            formPayment_id: formPayment.id,
            monthTransaction: "AUGUST",
            value: 400,
            category_id: category.id,
            transaction_at: new Date().toString(),
            installments: 2
        })
        
        expect(expense?.id).toEqual(expenseCreated.id)
        expect(invoices).toHaveLength(2)
        expect(invoices).toEqual([
            expect.objectContaining({
                monthTransaction: "AUGUST"
            }),
            expect.objectContaining({
                monthTransaction: "SEPTEMBER"
            })
        ])
    })

    it("should not able to create an expense with wrong form payment", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const formPayment = await formPaymentRepository.create({
            user_id: user.id,
            name: "Conta corrente",
        })

        const category = await categoryRepository.create({
            user_id: user.id,
            name: "Investimento",
            transaction_type: "EXPENSE"
        })

        const {expense: expenseCreated, invoices: invoicesCreated} = await expenseRepository.create({
            user_id: user.id,
            formPayment_id: formPayment.id,
            category_id: category.id,
            transaction_at: new Date().toString(),
            Invoices: {
                 createMany: {
                    data: [
                        {
                            monthTransaction: "JULY",
                            value: 500,
                            created_at: new Date()
                        }
                    ]
                 }
            }
        })

        expect(async () => {
            await updateExpenseService.handle({
                id: expenseCreated.id,
                user_id: user.id,
                monthTransaction: "JULY",
                value: 500,
                formPayment_id: "Wrong formPayment ID",
                transaction_at: new Date().toString(),
                installments: 1
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(FormPaymentNotExists)
        }))
    })

    it("should not able to create an expense with wrong category", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const formPayment = await formPaymentRepository.create({
            user_id: user.id,
            name: "Conta corrente",
        })

        const category = await categoryRepository.create({
            user_id: user.id,
            name: "Investimento",
            transaction_type: "EXPENSE"
        })

        const {expense: expenseCreated, invoices: invoicesCreated} = await expenseRepository.create({
            user_id: user.id,
            formPayment_id: formPayment.id,
            category_id: category.id,
            transaction_at: new Date().toString(),
            Invoices: {
                 createMany: {
                    data: [
                        {
                            monthTransaction: "JULY",
                            value: 500,
                            created_at: new Date()
                        }
                    ]
                 }
            }
        })

        expect(async () => {
            await updateExpenseService.handle({
                id: expenseCreated.id,
                user_id: user.id,
                monthTransaction: "JULY",
                value: 500,
                category_id: "wrong category ID",
                transaction_type: "EXPENSE",
                transaction_at: new Date().toString(),
                installments: 1
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(CategoryNotExists)
        }))
    })

    it("should not able to create an expense with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const formPayment = await formPaymentRepository.create({
            user_id: user.id,
            name: "Conta corrente",
        })

        const category = await categoryRepository.create({
            user_id: user.id,
            name: "Investimento",
            transaction_type: "EXPENSE"
        })

        const {expense: expenseCreated, invoices: invoicesCreated} = await expenseRepository.create({
            user_id: user.id,
            formPayment_id: formPayment.id,
            category_id: category.id,
            transaction_at: new Date().toString(),
            Invoices: {
                 createMany: {
                    data: [
                        {
                            monthTransaction: "JULY",
                            value: 500,
                            created_at: new Date()
                        }
                    ]
                 }
            }
        })

        expect(async () => {
            await updateExpenseService.handle({
                id: expenseCreated.id,
                user_id: "Wrong user",
                monthTransaction: "JULY",
                value: 500,
                transaction_type: "EXPENSE",
                transaction_at: new Date().toString(),
                installments: 1
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })
})
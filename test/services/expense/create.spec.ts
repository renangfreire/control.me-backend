
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

let userRepository: UsersRepository
let formPaymentRepository: FormPaymentRepository
let createExpenseService: CreateExpenseService
let categoryRepository: CategoryRepository
let expenseRepository: ExpenseRepository

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        formPaymentRepository = new InMemoryFormPaymentRepository()
        categoryRepository = new InMemoryCategoryRepository()
        expenseRepository = new InMemoryExpenseRepository()
        createExpenseService = new CreateExpenseService(userRepository, categoryRepository, formPaymentRepository, expenseRepository)
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

        const { expense, invoices } = await createExpenseService.handle({
            user_id: user.id,
            formPayment_id: formPayment.id,
            monthTransaction: "JULY",
            value: 500,
            category_id: category.id,
            transaction_type: "EXPENSE",
            transaction_at: new Date().toString(),
            installments: 2
        })
        
        expect(expense.id).toEqual(expect.any(String))
        expect(invoices).toHaveLength(2)
        expect(invoices).toEqual([
            expect.objectContaining({
                monthTransaction: "JULY"
            }),
            expect.objectContaining({
                monthTransaction: "AUGUST"
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

        expect(async () => {
            await createExpenseService.handle({
                user_id: user.id,
                monthTransaction: "JULY",
                value: 500,
                formPayment_id: "Wrong formPayment ID",
                transaction_type: "EXPENSE",
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

        const category = await categoryRepository.create({
            user_id: user.id,
            name: "Investimento",
            transaction_type: "EXPENSE"
        })

        expect(async () => {
            await createExpenseService.handle({
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

        expect(async () => {
            await createExpenseService.handle({
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
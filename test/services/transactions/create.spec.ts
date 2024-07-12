
import { CategoryRepository } from "@/core/repositories/category-repository";
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";
import { TransactionRepository } from "@/core/repositories/transactions-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";
import { FormPaymentNotExists } from "@/main/errors/FormPaymentNotExists";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryFormPaymentRepository } from "@/repositories/in-memory/in-memory-forms-payment";
import { InMemoryTransactionRepository } from "@/repositories/in-memory/in-memory-transaction";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { CreateTransactionService } from "@/services/transactions/create";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

let userRepository: UsersRepository
let formPaymentRepository: FormPaymentRepository
let createTransactionService: CreateTransactionService
let categoryRepository: CategoryRepository
let transactionRepository: TransactionRepository

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        formPaymentRepository = new InMemoryFormPaymentRepository()
        categoryRepository = new InMemoryCategoryRepository()
        transactionRepository = new InMemoryTransactionRepository()
        createTransactionService = new CreateTransactionService(userRepository, categoryRepository, formPaymentRepository, transactionRepository)
    })

    it("should be able create transaction", async () => {
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

        const { transaction, invoices } = await createTransactionService.handle({
            user_id: user.id,
            formPayment_id: formPayment.id,
            monthTransaction: "JULY",
            value: 500,
            category_id: category.id,
            transaction_type: "EXPENSE",
            transaction_at: new Date().toString(),
            installments: 2
        })
        
        expect(transaction.id).toEqual(expect.any(String))
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

    it("should not able to create a transaction with wrong category", async () => {
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
            await createTransactionService.handle({
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

    it("should not able to create a transaction with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        expect(async () => {
            await createTransactionService.handle({
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
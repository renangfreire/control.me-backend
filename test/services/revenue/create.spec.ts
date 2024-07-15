
import { CategoryRepository } from "@/core/repositories/category-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateRevenueService } from "@/services/revenue/create";
import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { InMemoryRevenueRepository } from "@/repositories/in-memory/in-memory-revenue";

let userRepository: UsersRepository
let createRevenueService: CreateRevenueService
let categoryRepository: CategoryRepository
let revenueRepository: RevenueRepository

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        categoryRepository = new InMemoryCategoryRepository()
        revenueRepository = new InMemoryRevenueRepository()
        createRevenueService = new CreateRevenueService(userRepository, categoryRepository, revenueRepository)
    })

    it("should be able create revenue", async () => {
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

        const { revenue } = await createRevenueService.handle({
            user_id: user.id,
            monthTransaction: "JULY",
            value: 500,
            category_id: category.id,
            transaction_at: new Date().toString(),
        })
        
        expect(revenue.id).toEqual(expect.any(String))
    })

    it("should not able to create an revenue with wrong category", async () => {
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
            await createRevenueService.handle({
                user_id: user.id,
                monthTransaction: "JULY",
                value: 500,
                category_id: "wrong category ID",
                transaction_at: new Date().toString(),
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(CategoryNotExists)
        }))
    })

    it("should not able to create an revenue with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        expect(async () => {
            await createRevenueService.handle({
                user_id: "Wrong user",
                monthTransaction: "JULY",
                value: 500,
                transaction_at: new Date().toString(),
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })
})
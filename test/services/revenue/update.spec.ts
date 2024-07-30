
import { CategoryRepository } from "@/core/repositories/category-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { CategoryNotExists } from "@/main/errors/CategoryNotExists";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";
import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { InMemoryRevenueRepository } from "@/repositories/in-memory/in-memory-revenue";
import { UpdateRevenueService } from "@/services/revenue/update";

let userRepository: UsersRepository
let updateRevenueService: UpdateRevenueService
let categoryRepository: CategoryRepository
let revenueRepository: RevenueRepository

describe("Update (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        categoryRepository = new InMemoryCategoryRepository()
        revenueRepository = new InMemoryRevenueRepository()
        updateRevenueService = new UpdateRevenueService(userRepository, categoryRepository, revenueRepository)
    })

    it("should be able update revenue", async () => {
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

        const revenue = await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "JULY",
            value: 500,
            category_id: category.id,
            transaction_at: new Date().toString(),
        })

        const { revenue: updatedRevenue } = await updateRevenueService.handle({
            id: revenue.id,
            user_id: user.id,
            monthTransaction: "AUGUST",
            value: 800,
            category_id: category.id,
            transaction_at: new Date().toString(),
        })
        
        expect(updatedRevenue.id).toEqual(expect.any(String))
        expect(updatedRevenue.monthTransaction).toEqual("AUGUST")
        expect(updatedRevenue.value.toNumber()).toEqual(800)
    })

    it("should not able to update an revenue with wrong category", async () => {
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

        const revenue = await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "JULY",
            value: 500,
            category_id: category.id,
            transaction_at: new Date().toString(),
        })

        expect(async () => {
            await updateRevenueService.handle({
                id: revenue.id,
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

    it("should not able to update an revenue with another user who created", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const anotherUser = await userRepository.create({
            name: "Another Doe",
            email: "anotherDoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const revenue = await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "JULY",
            value: 500,
            transaction_at: new Date().toString(),
        })

        expect(async () => {
            await updateRevenueService.handle({
                id: revenue.id,
                user_id: anotherUser.id,
                monthTransaction: "JULY",
                value: 500,
                transaction_at: new Date().toString(),
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

    it("should not able to update an revenue with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const revenue = await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "JULY",
            value: 500,
            transaction_at: new Date().toString(),
        })

        expect(async () => {
            await updateRevenueService.handle({
                id: revenue.id,
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
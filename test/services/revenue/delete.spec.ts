
import { CategoryRepository } from "@/core/repositories/category-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";
import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { InMemoryRevenueRepository } from "@/repositories/in-memory/in-memory-revenue";
import { DeleteRevenueService } from "@/services/revenue/delete";

let userRepository: UsersRepository
let deleteRevenueService: DeleteRevenueService
let categoryRepository: CategoryRepository
let revenueRepository: RevenueRepository

describe("Delete (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        categoryRepository = new InMemoryCategoryRepository()
        revenueRepository = new InMemoryRevenueRepository()
        deleteRevenueService = new DeleteRevenueService(userRepository, revenueRepository)
    })

    it("should be able delete revenue", async () => {
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

        const { revenue: deletedRevenue } = await deleteRevenueService.handle({
            id: revenue.id,
            user_id: user.id,
        })
        
        expect(deletedRevenue.id).toEqual(revenue.id)
    })

    it("should not able to delete an revenue with another user who created", async () => {
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
            await deleteRevenueService.handle({
                id: revenue.id,
                user_id: anotherUser.id,
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

    it("should not able to delete an revenue with wrong user", async () => {
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
            await deleteRevenueService.handle({
                id: revenue.id,
                user_id: "Wrong user",
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })
})
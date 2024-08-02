
import { CategoryRepository } from "@/core/repositories/category-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";
import { RevenueRepository } from "@/core/repositories/revenue-repository";
import { InMemoryRevenueRepository } from "@/repositories/in-memory/in-memory-revenue";
import { FetchRevenues } from "@/services/revenue/fetchRevenues";

let userRepository: UsersRepository
let fetchRevenues: FetchRevenues
let categoryRepository: CategoryRepository
let revenueRepository: RevenueRepository

describe("Get (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        categoryRepository = new InMemoryCategoryRepository()
        revenueRepository = new InMemoryRevenueRepository()
        fetchRevenues = new FetchRevenues(userRepository, revenueRepository)
    })

    it("should be able fetch revenues", async () => {
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

        await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "DECEMBER",
            value: 400,
            category_id: category.id,
            transaction_at: new Date().toString(),
        })
        
        await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "AUGUST",
            value: 240,
            category_id: category.id,
            transaction_at: new Date().toString(),
        })

        for(let i = 0; i < 20; i++){
            await revenueRepository.create({
                user_id: user.id,
                monthTransaction: "JULY",
                value: 500,
                category_id: category.id,
                transaction_at: new Date().toString(),
            })
        }


        const { revenues } = await fetchRevenues.handle({
            user_id: user.id,
            page: 1
        })
        
        expect(revenues).toHaveLength(20)
        expect(revenues).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining({
                        monthTransaction: "JULY"
                    }),
                    expect.objectContaining({
                        monthTransaction: "DECEMBER"
                    }),
                    expect.objectContaining({
                        monthTransaction: "AUGUST"
                    })
                ]
            )
        )
    })

    it("should not able to create an revenue with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        await revenueRepository.create({
            user_id: user.id,
            monthTransaction: "AUGUST",
            value: 240,
            transaction_at: new Date().toString(),
        })

        expect(async () => {
            await fetchRevenues.handle({
                user_id: "Wrong UserId",
                page: 1
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })
})
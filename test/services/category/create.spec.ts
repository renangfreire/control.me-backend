
import { CategoryRepository } from "@/core/repositories/category-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { CreateCategoryService } from "@/services/category/create";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

let userRepository: UsersRepository
let categoryRepository: CategoryRepository
let categoryService: CreateCategoryService

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        categoryRepository = new InMemoryCategoryRepository()
        categoryService = new CreateCategoryService(userRepository, categoryRepository)
    })

    it("should be able create transaction category", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const { category } = await categoryService.handle({
            name: "Investimento",
            transaction_type: "EXPENSE",
            user_id: user.id
        })

        expect(category.id).toEqual(expect.any(String))
    })

    it("should not able to create transaction with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        expect(async () => {
            await categoryService.handle({
                name: "Investimento",
                transaction_type: "EXPENSE",
                user_id: "Wrong Id"
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })
})
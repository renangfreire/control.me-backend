
import { CategoryRepository } from "@/core/repositories/category-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { DeleteCategoryService } from "@/services/category/delete";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

let userRepository: UsersRepository
let categoryRepository: CategoryRepository
let deleteCategoryService: DeleteCategoryService

describe("Delete (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        categoryRepository = new InMemoryCategoryRepository()
        deleteCategoryService = new DeleteCategoryService(userRepository, categoryRepository)
    })

    it("should be able to update form payment", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const createdCategory = await categoryRepository.create({
            name: "Investimento",
            transaction_type: "EXPENSE",
            user_id: user.id
        })

        const { category } = await deleteCategoryService.handle({
            category_id: createdCategory.id,
            user_id: user.id
        })

        expect(category.id).toEqual(createdCategory.id)
    })

    it("should not able delete category with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const createdCategory = await categoryRepository.create({
            name: "Investimento",
            transaction_type: "EXPENSE",
            user_id: user.id
        })

        expect(async () => {
            await deleteCategoryService.handle({
                category_id: createdCategory.id,
                user_id: "Wrong Id"
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

    it("should not able delete transaction category with wrong category id", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        expect(async () => {
            await deleteCategoryService.handle({
                category_id: "Wrong Id",
                user_id: user.id
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

    it("should not able delete category with another user than the who created category", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const createdCategory = await categoryRepository.create({
            name: "Investimento",
            transaction_type: "EXPENSE",
            user_id: "another user"
        })

        expect(async () => {
            await deleteCategoryService.handle({
                category_id: createdCategory.id,
                user_id: user.id
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })
})

import { InvalidInput } from "@/main/errors/InvalidInput";
import { UserAlreadyExists } from "@/main/errors/UserAlreadyExists";
import { UsersRepository } from "@/repositories/@types/user-repository";
import { inMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { CreateUserService } from "@/services/user/create";
import { beforeEach, describe, expect, it } from "vitest";

let userServices: CreateUserService
let userRepository: UsersRepository

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new inMemoryUserRepository()
        userServices = new CreateUserService(userRepository)
    })

    it("should be able create user", async () => {
        const { user } = await userServices.handle({
            email: "johndoe@example.com",
            password: "1234567",
            name: "John doe"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should not able to create user with duplicated email", async () => {
        await userServices.handle({
            email: "johndoe@example.com",
            password: "1234567",
            name: "John doe"
        })

        await expect(async () => {
            await userServices.handle({
                email: "johndoe@example.com",
                password: "1234567",
                name: "John doe with same email"
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(UserAlreadyExists)
        }))
    })

    it("should not able to create user with password less than minimum", async () => {
        await expect(async () => {
            await userServices.handle({
                email: "johndoe@example.com",
                password: "123456",
                name: "John doe with same email"
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(InvalidInput)
        }))
    })
})
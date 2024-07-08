
import { InvalidCredentials } from "@/main/errors/InvalidCredentials";
import { InvalidInput } from "@/main/errors/InvalidInput";
import { UserAlreadyExists } from "@/main/errors/UserAlreadyExists";
import { UsersRepository } from "@/repositories/@types/user-repository";
import { inMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { AuthenticateUserService } from "@/services/user/authenticate";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

let authenticateUserService: AuthenticateUserService
let userRepository: UsersRepository

describe("Authenticate (unit)", async () => {
    beforeEach(async () => {
        userRepository = new inMemoryUserRepository()
        authenticateUserService = new AuthenticateUserService(userRepository)
    })

    it("should be able authenticate user", async () => {
        await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const { user } = await authenticateUserService.handle({
            email: "johndoe@example.com",
            password: "1234567",
        })

        console.log(user)

        expect(user.id).toEqual(expect.any(String))
    })

    it("should not able to authenticate user with wrong email", async () => {
        await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        await expect(async () => {
            await authenticateUserService.handle({
                email: "wrong-johndoe@example.com",
                password: "1234567",
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(InvalidCredentials)
        }))
    })

    it("should not able to authenticate user with wrong password", async () => {
        await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        await expect(async () => {
            await authenticateUserService.handle({
                email: "johndoe@example.com",
                password: "123456",
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(InvalidCredentials)
        }))
    })
})

import { InvalidInput } from "@/main/errors/InvalidInput";
import { UserAlreadyExists } from "@/main/errors/UserAlreadyExists";
import { FormPaymentRepository } from "@/repositories/@types/form-payment-repository";
import { UsersRepository } from "@/repositories/@types/user-repository";
import { InMemoryFormPaymentRepository } from "@/repositories/in-memory/in-memory-forms-payment";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { FormPaymentService } from "@/services/formPayment/create";
import { CreateUserService } from "@/services/user/create";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

let userRepository: UsersRepository
let formPaymentRepository: FormPaymentRepository
let formPaymentService: FormPaymentService

describe("Create (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        formPaymentRepository = new InMemoryFormPaymentRepository()
        formPaymentService = new FormPaymentService(userRepository, formPaymentRepository)
    })

    it("should be able create form payment", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const { formPayment } = await formPaymentService.handle({
            name: "Conta corrente",
            user_id: user.id
        })

        expect(formPayment.id).toEqual(expect.any(String))
    })
})
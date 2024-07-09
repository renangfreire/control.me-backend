
import { FormPaymentRepository } from "@/core/repositories/form-payment-repository";
import { UsersRepository } from "@/core/repositories/user-repository";
import { ResourcesNotFound } from "@/main/errors/ResourcesNotFound";
import { InMemoryFormPaymentRepository } from "@/repositories/in-memory/in-memory-forms-payment";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { DeleteFormPaymentService } from "@/services/formPayment/delete";
import { hash } from "bcrypt";
import { beforeEach, describe, expect, it } from "vitest";

let userRepository: UsersRepository
let formPaymentRepository: FormPaymentRepository
let deleteFormPaymentService: DeleteFormPaymentService

describe("Delete (unit)", async () => {
    beforeEach(async () => {
        userRepository = new InMemoryUserRepository()
        formPaymentRepository = new InMemoryFormPaymentRepository()
        deleteFormPaymentService = new DeleteFormPaymentService(userRepository, formPaymentRepository)
    })

    it("should be able delete form payment", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const createdFormPayment = await formPaymentRepository.create({
            name: "Conta corrente",
            user_id: user.id
        })

        const { formPayment } = await deleteFormPaymentService.handle({
            id: createdFormPayment.id,
            user_id: user.id
        })

        expect(formPayment.id).toEqual(expect.any(String))
    })

    it("should not able delete form payment with wrong user", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const createdFormPayment = await formPaymentRepository.create({
            name: "Conta corrente",
            user_id: user.id
        })

        expect(async () => {
            await deleteFormPaymentService.handle({
                id: createdFormPayment.id,
                user_id: "Wrong Id"
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

    it("should not able delete form payment with wrong form_payment id", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        expect(async () => {
            await deleteFormPaymentService.handle({
                id: "Wrong Id",
                user_id: user.id
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

    it("should not able delete form payment with another user than the who created form payment", async () => {
        const user = await userRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("1234567", 7),
        })

        const createdFormPayment = await formPaymentRepository.create({
            name: "Conta corrente",
            user_id: "another user"
        })

        expect(async () => {
            await deleteFormPaymentService.handle({
                id: createdFormPayment.id,
                user_id: user.id
            })
        }).rejects.toEqual(expect.objectContaining({
            status: expect.any(Number),
            body: expect.any(ResourcesNotFound)
        }))
    })

   
})
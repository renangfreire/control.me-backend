import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../../core/repositories/@types/user-repository";
import { randomUUID } from "crypto";

interface inMemoryDatabase {
    Users: User[]
}

export class InMemoryUserRepository implements UsersRepository{
    #db: inMemoryDatabase = {
        Users: []
    }

    async create(data: Prisma.UserCreateInput){
        const userData = {
            ...data,
            id: randomUUID(),
            name: data.name || null
        }

        this.#db.Users.push(userData)

        return userData
    }

    async findByEmail(email: string) {
       const user = this.#db.Users.find((user) => user.email === email)

       return user || null
    }

    async findById(userId: string){
        const user = this.#db.Users.find((user) => user.id === userId)

       return user || null
    }
}
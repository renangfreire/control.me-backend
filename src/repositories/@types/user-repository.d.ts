import { Prisma, User } from "@prisma/client";

export interface UsersRepository{
    async create(data: Prisma.UserCreateInput) : Promise<User>
    async findByEmail(email: string): Promise<User | null>
    async findById(userId: string): Promise<User | null>
}
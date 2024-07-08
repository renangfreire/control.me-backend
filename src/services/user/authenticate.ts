import { UsersRepository } from "@/repositories/@types/user-repository";
import { badRequest } from "@/main/helpers";
import { compare } from "bcrypt";
import { InvalidCredentials } from "@/main/errors/InvalidCredentials";
import fastifyJwt from "@fastify/jwt";

interface authenticateUserRequestSchema {
    email: string,
    password: string,
}

export class AuthenticateUserService{
    constructor(
        private userRepository: UsersRepository
    ){}

    async handle({email, password}: authenticateUserRequestSchema){
        const existentUser = await this.userRepository.findByEmail(email)

        if(!existentUser){
            throw badRequest(new InvalidCredentials())
        }

        const passwordIsEqual = await compare(password, existentUser.password_hash)

        if(!passwordIsEqual){
            throw badRequest(new InvalidCredentials())
        }

        const {password_hash, ...user} = existentUser

        return {
            user
        }

    }
}
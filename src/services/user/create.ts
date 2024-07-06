import { UsersRepository } from "@/repositories/@types/user-repository";
import { conflict } from "@/main/helpers";
import { UserAlreadyExists } from "@/main/errors/UserAlreadyExists";
import { hash } from "bcrypt";

interface createUserRequestSchema {
    email: string,
    password: string,
    name?: string | null
}
export class CreateUserServices{
    constructor(
        private userRepository: UsersRepository
    ){}

    async handle({email, password, name}: createUserRequestSchema){
        const hasUserWithSameEmail = await this.userRepository.findByEmail(email)

        if(hasUserWithSameEmail){
            throw conflict(new UserAlreadyExists())
        }

        const password_hash = await hash(password, 7)

        const user = this.userRepository.create({
            email, 
            password_hash, 
            name
        })

        return {
            user
        }

    }
}
import { UsersRepository } from "@/repositories/@types/user-repository";
import { badRequest, conflict } from "@/main/helpers";
import { UserAlreadyExists } from "@/main/errors/UserAlreadyExists";
import { hash } from "bcrypt";
import { InvalidInput } from "@/main/errors/InvalidInput";

interface createUserRequestSchema {
    email: string,
    password: string,
    name?: string | null
}
export class CreateUserService{
    constructor(
        private userRepository: UsersRepository
    ){}

    async handle({email, password, name}: createUserRequestSchema){
        const passwordMinimumChars = 7

        const hasUserWithSameEmail = await this.userRepository.findByEmail(email)

        if(hasUserWithSameEmail){
            throw conflict(new UserAlreadyExists())
        }

        const passwordHasMinimumChars = password.length >= passwordMinimumChars

        if(!passwordHasMinimumChars){
            throw badRequest(new InvalidInput())
        }

        const password_hash = await hash(password, 7)

        const user = await this.userRepository.create({
            email, 
            password_hash, 
            name
        })

        return {
            user
        }

    }
}
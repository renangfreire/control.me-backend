import fastify, { FastifyReply } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify()

app.setErrorHandler(async (error: any, _, reply: FastifyReply) => {
    if(error instanceof ZodError){
        return reply.status(400).send({ message: "Validation Error", issues: error.format()})
    }

    if(env.NODE_ENV !== "production"){
        console.error(error)
    } else {
        // TODO: adicionar integração com serviço de Logs ex: DataDog/NewRelic/Sentry
    }

    if(!error.status){
        return reply.status(500).send("Internal Server Error")
    }

    reply.status(error.status).send(error.body.message)
})
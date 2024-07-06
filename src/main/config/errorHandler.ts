import { FastifyInstance, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";

export async function errorHandler(app: FastifyInstance){
    app.setErrorHandler(async (error: any, _, reply: FastifyReply) => {
        console.log("erro")
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
}
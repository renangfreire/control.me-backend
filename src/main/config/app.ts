import fastify from "fastify";
import { appRoutes } from "./routes";
import { errorHandler } from "./errorHandler";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import fastifyCookie from "@fastify/cookie";

export const app = fastify()

errorHandler(app)

app.register(appRoutes)
app.register(fastifyCookie)
app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})
import fastify from "fastify";
import { appRoutes } from "./routes";
import { errorHandler } from "./errorHandler";

export const app = fastify()

app.register(appRoutes)
errorHandler(app)
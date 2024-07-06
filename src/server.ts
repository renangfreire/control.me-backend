import { app } from "@/main/config/app";
import { env } from "./main/config/env";

app.listen({
    port: env.PORT
}).then(() => {
    console.log(`Server listen on port ${env.PORT}`)
})
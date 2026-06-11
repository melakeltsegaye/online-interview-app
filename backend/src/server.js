import express from "express"
import { ENV } from "./lib/env.js"
import path from "path"
import { connectDB } from "./lib/db.js"
import cors from "cors"
import {inngest, functions} from "./lib/inngest.js"
import {serve} from "inngest/express"
import {clerkMiddleware} from '@clerk/express'
import { protectRoute } from "./middleware/protectRoute.js"
import chatRoutes  from "./routers/chatRoutes.js"

const app = express()

const __dirname = path.resolve()

app.use(express.json())
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}))
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions}))
app.use("/api/chat", chatRoutes)

app.get("/hi", (req, res) => {
    res.status(200).json({message: "success ok"})
})

app.get("/books", protectRoute, (req, res) => {
    res.status(200).json({message: "success books"})
})



if(ENV.NODE_ENV === "production") {
     const frontendPath = path.join(__dirname, "../frontend/dist");

    console.log(frontendPath);

    app.use(express.static(frontendPath));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

const startServer = async () => {
    try {
        await connectDB()
        app.listen(ENV.PORT, () => console.log("✅ Server connected successfuly"))
    } catch (error) {
        console.error("Error while connecting", error)
    }
}

startServer()
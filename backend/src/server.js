import express from "express"
import { ENV } from "./lib/env.js"
import path from "path"
import { connectDB } from "./lib/db.js"

const app = express()

const __dirname = path.resolve()


// app.get("/books", (req, res) => {
//     res.status(200).json({message: "success books"})
// })



if(ENV.NODE_ENV === "production") {
    console.log(
  path.join(__dirname, "../frontend/dist")
)
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"../frontend", "dist", "index.html"))
    })
}

const startServer = async () => {
    try {

        app.listen(ENV.PORT, () => console.log("✅ Server connected successfuly"))
    } catch (error) {
        console.error("Error while connecting", error)
    }
}

startServer()
import express from "express"
import { ENV } from "./lib/env.js"

const app = express()

app.get("/", (req, res) => {
    res.status(200).json({message: "success ok"})
})

app.listen(ENV.PORT, () => console.log("server is runing on port", ENV.PORT))
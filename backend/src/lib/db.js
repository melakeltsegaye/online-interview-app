import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
    try {
        if(!ENV.DB_URL) {
            throw new error("DB_URL is not defiend in enviroment variabel")
        }
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("✅ db conencted successfuly", conn.connection.host)
    } catch (error) {
        console.error("❌ error while connecting to the db", error)
       process.exit(1) 
    }
}
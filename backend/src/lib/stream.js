import {StreamChat} from "stream-chat"
import {StreamClient} from "@stream-io/node-sdk"
import {ENV} from "./env.js"


const apikey = ENV.STREAM_API_KEY
const apisecret = ENV.STREAM_API_SECRET

if(!apikey || !apisecret) {
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing")
}


export const chatClient = StreamChat.getInstance(apikey, apisecret)
export const streamClient = new StreamClient(apikey, apisecret)

export const upsertStream = async (userData) => {
    try {
        await chatClient.upsertUser(userData)
        console.log("stream user upserte successfully: ", userData)
    } catch (error) {
        console.error("error upserting stream user: ", error)
    }
}

export const deleteStream = async (userId) => {
    try {
        await chatClient.deleteUser([userId])
        console.log("stream user deleted successfully: ", userId)
    
    } catch (error) {
        console.error("error deleting the stream user: ", error)
    }
}
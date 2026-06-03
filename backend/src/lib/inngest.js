import {Inngest} from "inngest"
import { connectDB } from "./db.js";
import User from "../models/User.js"


export const inngest = new Inngest({ id: "online-interview"})


const syncUser = inngest.createFunction(
    {id: "sync-user"},
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB();

        const {id, email_addresses, first_name, last_name, image_url } = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_addresses,
            name: `${first_name || ""} ${last_name || ""}`,
            profileImage: image_url
        }

        await User.create(newUser)
    }
)

const delereUser = inngest.deleteFunction(
    {id: "delete-user"},
    {event: "clerk/user.delete"},
    async ({event}) => {
        await connectDB();

        const {id} = event.data;

        const newUser = {
            clerkId: id,
        }

        await User.delete(newUser)

        
    }
)


export const functions = [syncUser, delereUser]
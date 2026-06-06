import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStream, upsertStream } from "./stream.js";

export const inngest = new Inngest({ id: "talent-iq" });

const syncUser = inngest.createFunction(
  { 
        id: "sync-user",
        triggers: [{ event: "clerk/user.created" }] 
    },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStream({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        profileImage: newUser.profileImage,
    })

  }
);

const deleteUserFromDB = inngest.createFunction(
  { 
        id: "delete-user",
        triggers: [{ event: "clerk/user.deleted" }] // Note: Clerk uses "user.deleted" (past tense)
    },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

     await deleteStream(id.toString())
  }
);

export const functions = [syncUser, deleteUserFromDB];
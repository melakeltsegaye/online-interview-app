
import { streamClient,chatClient } from "../lib/stream.js";
import Session from "../models/Session.js";


export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body;
        const userId =req.user._id;
        const clerkId = req.user.clerkId;

        if (!problem || !difficulty) {
            return res.status(400).json({ message: "problem and difficulty are required"})
        }

        const callId= `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const session = await Session.create({ problem, difficulty, host: userId, callId})

        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {problem, difficulty, sessionId: session._id.toString()}
            }
        })

        const channel = chatClient.channel("messaging", callId,{
            name:`${problem} Session`,
            created_by_id: clerkId,
            members:[clerkId]
        })

        await channel.create()

        res.status(200).json({session})
    } catch (error) {
        console.log("error in createsession controller:", error.message)
        res.status(500).json({ message: "internal server error"})
    }
}


export async function getActiveSessions(req, res) {
    try {
        const sessions =  await Session.find({ status: "active"}).populate("host", "name profileImage email clerkId").sort({ createdAt: -1}).limit(20)

        res.status(200).json({sessions})
    } catch (error) {
        console.log("error in getActiveSessions controller:", error.message)
        res.status(500).json({ message: "internal server error"})
    }
}


export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}``


export async function getSessionById(req, res) {
    try {
         const {id} = req.params

         const session= await Session.findById(id).populate("host", "name email profileImage clerkId").populate("participant", "name email progileImage clerkId")

         if (!session) return res.status(404).json({ message: "session not found"})
        
        res.status(200).json({ session })
    } catch (error) {
        console.log("error in gersessionbyid controller", error.message)
        res.status(500).json({message: "internal server error"})
    }
}


export async function joinSession(req, res) {
    try {
        const {id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)
        
        if (!session) return res.status(404).json({message:"session not found"})

        if(session.status !== "active") {
            return res.status(400).json({message: "can not join a completed session"})
        }
         
        if(session.host.toString() === userId.toString()){
            return res.status(400).json({message:"host can not join their own session as participant"})
        }
        if(session.participant) return res.status(409).json({message:"session is full"})    

        session.participant=userId
        await session.save()

        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers({clerkId})

        res.status(200).json({session})
    } catch (error) {
        console.log("Error while runing joinSession controller", error.message)
        res.status(500).json({message:"unternal server error"})
    }
}


export async function endSession(req, res) {
    try {
        const {id} = req.params

        const userId = req.user._id
        const session = await Session.findById(id);

        if(!session) return res.status(404).json({message:"session not found"})
       if(session.host.toString() !== userId.toString()){
    return res.status(403).json({message:"only host can end this session"})
}

if(session.status === "completed") { 
    return res.status(400).json({ message: "session is already completed"})
}


       session.status = "completed"
await session.save()

const call = streamClient.video.call("default", session.callId)
await call.delete()

const channel = chatClient.channel("messaging", session.callId)
await channel.delete()

res.status(200).json({ session, message: "session ended successfully" })
    } catch (error) {
         console.log("Error while runing endSession controller", error.message)
        res.status(500).json({message:"Internal server error"})
    }
}
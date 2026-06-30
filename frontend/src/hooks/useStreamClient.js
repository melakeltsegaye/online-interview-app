import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  const hasJoinedRef = useRef(false); // prevents duplicate joins
  const callIdRef = useRef(null);

  useEffect(() => {
    if (!session?.callId) return;
    if (!isHost && !isParticipant) return;
    if (session.status === "completed") return;

    // ✅ skip re-running if we've already joined THIS exact call
    if (hasJoinedRef.current && callIdRef.current === session.callId) return;

    let videoCall = null;
    let chatClientInstance = null;
    let cancelled = false;

    const initCall = async () => {
      try {
        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        const client = await initializeStreamClient(
          { id: userId, name: userName, image: userImage },
          token
        );

        if (cancelled) return;
        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });

        if (cancelled) {
          await videoCall.leave(); // in case unmounted mid-join
          return;
        }

        setCall(videoCall);
        hasJoinedRef.current = true;
        callIdRef.current = session.callId;

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );

        if (cancelled) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();

        if (cancelled) return;
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        if (!cancelled) setIsInitializingCall(false);
      }
    };

    initCall();

    return () => {
      cancelled = true;
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          hasJoinedRef.current = false;
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
    // ✅ only depend on the actual call id, not the whole session object
  }, [session?.callId, session?.status, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { io } from "socket.io-client";
import showToast from "../../../lib/toast";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  FaPaperPlane,
  FaImage,
  FaFileUpload,
  FaMicrophone,
  FaStop,
  FaSearch,
  FaBuilding,
  FaUserCircle,
  FaCheckDouble,
  FaTimes,
} from "react-icons/fa";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const Chat = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const imageFileRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadingChatImage, setUploadingChatImage] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState(null);
  const timerRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user?.email) return;

    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current.emit("join_room", user.email);

    socketRef.current.on("receive_message", (newMsg) => {
      if (
        (newMsg.senderEmail === user.email && newMsg.recipientEmail === activeRecipient?.email) ||
        (newMsg.senderEmail === activeRecipient?.email && newMsg.recipientEmail === user.email)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        if (newMsg.recipientEmail === user.email) {
          socketRef.current.emit("mark_read", {
            userEmail: user.email,
            senderEmail: newMsg.senderEmail,
          });
        }
      }

      if (role === "admin") {
        fetchConversations();
      }
    });

    socketRef.current.on("messages_read", ({ senderEmail }) => {
      if (senderEmail === activeRecipient?.email || senderEmail === user.email) {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user?.email, activeRecipient?.email, role]);

  // Fetch admin conversation list
  const fetchConversations = async () => {
    try {
      const res = await axiosSecure.get("/chat/conversations");
      if (res.data?.success) {
        setConversations(res.data.conversations);
        if (!activeRecipient && res.data.conversations.length > 0) {
          setActiveRecipient(res.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setActiveRecipient({
        email: location.state.email,
        userName: location.state.userName || location.state.email,
        apartmentNo: location.state.apartmentNo || "Member",
      });
    }
  }, [location.state]);

  useEffect(() => {
    if (role === "admin") {
      fetchConversations();
    } else {
      setActiveRecipient({ email: "admin@nexora.com", apartmentNo: "Admin Support" });
    }
  }, [role]);

  // Fetch message history when active recipient changes
  useEffect(() => {
    if (!activeRecipient?.email || !user?.email) return;

    const fetchHistory = async () => {
      try {
        const res = await axiosSecure.get(`/chat/messages/${activeRecipient.email}`);
        if (res.data?.success) {
          setMessages(res.data.messages);
          axiosSecure.patch("/chat/read", { senderEmail: activeRecipient.email }).catch(console.error);
        }
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    };

    fetchHistory();
  }, [activeRecipient?.email, user?.email]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = (msgType = "text", payloadMediaUrl = "") => {
    if (!textInput.trim() && !payloadMediaUrl) return;

    const msgData = {
      senderEmail: user.email,
      recipientEmail: activeRecipient.email,
      message: textInput.trim(),
      type: msgType,
      mediaUrl: payloadMediaUrl,
    };

    if (socketRef.current) {
      socketRef.current.emit("send_message", msgData);
    }

    setTextInput("");
    setImageUrl("");
    setShowImageInput(false);
  };

  // Direct Image File Upload Handler in Chat (Max 1 MB)
  const handleImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      showToast.error("Image file size must be less than 1 MB.");
      e.target.value = "";
      return;
    }

    setUploadingChatImage(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await axiosSecure.post("/upload/image", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.url) {
        handleSendMessage("image", res.data.url);
        showToast.success("Image attached!");
      }
    } catch (err) {
      console.error("Chat image upload error:", err);
      showToast.error(err?.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingChatImage(false);
      e.target.value = "";
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          handleSendMessage("voice", base64Audio);
        };
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Filter conversations by Apartment Number, Block Name, User Name, or Email
  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.email?.toLowerCase().includes(q) ||
      c.userName?.toLowerCase().includes(q) ||
      c.apartmentNo?.toLowerCase().includes(q) ||
      c.blockName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-[calc(100vh-6rem)] p-2 md:p-6">
      <div className="bg-base-100 rounded-none border border-base-200 shadow-xl h-full flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar (Admin view - Bright, High Contrast) */}
        {role === "admin" && (
          <div className="w-full md:w-80 bg-base-100 border-r border-base-200 flex flex-col h-1/3 md:h-full">
            <div className="p-4 border-b border-base-200 bg-base-100">
              <h2 className="font-extrabold text-sm uppercase tracking-wider mb-3 flex items-center gap-2 text-base-content">
                <FaBuilding className="text-primary" /> Member Conversations
              </h2>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user, email or Apt A-101..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-sm input-bordered rounded-none border border-base-200 bg-base-200/50 w-full pl-9 font-bold text-xs"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 text-xs" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-base-200/60 bg-base-100">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-base-content/60 font-bold">No active conversations found.</div>
              ) : (
                filteredConversations.map((c) => (
                  <div
                    key={c.email}
                    onClick={() => setActiveRecipient(c)}
                    className={`p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                      activeRecipient?.email === c.email
                        ? "bg-primary/10 border-l-4 border-primary"
                        : "hover:bg-base-200/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={c.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                        alt={c.userName || c.email}
                        className="w-10 h-10 object-cover shrink-0 rounded-none border border-base-content/20 shadow-xs"
                      />
                      <div className="truncate">
                        <div className="font-extrabold text-sm truncate text-base-content">{c.userName || c.email}</div>
                        <div className="text-[11px] text-base-content/70 truncate font-mono">{c.email}</div>
                        <div className="text-[11px] text-base-content font-bold flex items-center gap-1 mt-0.5">
                          <FaBuilding className="text-[10px]" /> Apt: {c.apartmentNo} {c.blockName && `(${c.blockName})`}
                        </div>
                        <div className="text-xs text-base-content/60 truncate mt-0.5 font-medium">{c.lastMessage || "No messages yet"}</div>
                      </div>
                    </div>

                    {c.unreadCount > 0 && (
                      <span className="badge badge-error badge-sm text-white font-black rounded-none ml-2 shrink-0 px-2 py-1">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-base-100">
          {/* Header */}
          <div className="p-4 border-b border-base-200 flex items-center justify-between bg-base-100 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={activeRecipient?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
                alt="Recipient profile"
                className="w-10 h-10 object-cover rounded-none border border-base-content/20"
              />
              <div>
                <h3 className="font-extrabold text-base md:text-lg text-base-content uppercase tracking-wider">
                  {role === "admin" ? activeRecipient?.userName || activeRecipient?.email || "Select a member" : "Admin Support"}
                </h3>
                {activeRecipient?.apartmentNo && (
                  <p className="text-xs text-primary font-bold flex items-center gap-1">
                    <FaBuilding /> Apartment: {activeRecipient.apartmentNo}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages Canvas - High Contrast Bubbles */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-base-200/20">
            {messages.map((msg, idx) => {
              const isMe = msg.senderEmail === user?.email;
              return (
                <div key={msg._id || idx} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                  <div className="chat-header text-[11px] font-bold text-base-content/70 mb-1">
                    {msg.senderEmail} • {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* High Contrast Chat Bubble Styling */}
                  <div
                    className={`chat-bubble rounded-none text-sm font-semibold p-3 shadow-xs ${
                      isMe
                        ? "bg-primary text-primary-content border border-primary"
                        : "bg-base-100 text-base-content border border-base-300"
                    }`}
                  >
                    {msg.type === "image" && msg.mediaUrl && (
                      <div className="mb-2 max-w-full overflow-hidden">
                        <img
                          src={msg.mediaUrl}
                          alt="Shared attachment"
                          className="w-full max-w-[70vw] sm:max-w-xs md:max-w-sm max-h-64 sm:max-h-80 rounded-none object-cover border border-base-300 cursor-pointer hover:opacity-90 transition-all duration-200"
                          onClick={() => setPreviewModalImage(msg.mediaUrl)}
                        />
                      </div>
                    )}

                    {msg.type === "voice" && msg.mediaUrl && (
                      <div className="p-1">
                        <audio controls src={msg.mediaUrl} className="max-w-xs" />
                      </div>
                    )}

                    {msg.message && <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>}
                  </div>

                  <div className="chat-footer opacity-70 text-[10px] flex items-center gap-1 mt-1 font-bold text-base-content/70">
                    {isMe && <FaCheckDouble className={msg.read ? "text-info" : "text-base-content/40"} />}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Input URL Bar (Toggleable fallback) */}
          {showImageInput && (
            <div className="p-3 bg-base-100 border-t border-base-200 flex items-center gap-2">
              <input
                type="url"
                placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input input-sm input-bordered rounded-none border border-base-200 flex-1 font-mono text-xs"
              />
              <button
                onClick={() => {
                  if (imageUrl) {
                    handleSendMessage("image", imageUrl);
                  }
                }}
                className="btn btn-sm btn-primary rounded-none font-bold uppercase"
              >
                Send
              </button>
              <button
                onClick={() => setShowImageInput(false)}
                className="btn btn-sm btn-ghost btn-square"
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Hidden File Input for Direct Image Upload */}
          <input
            type="file"
            accept="image/*"
            ref={imageFileRef}
            onChange={handleImageFileSelect}
            className="hidden"
          />

          {/* Message Input Footer */}
          <div className="p-3 md:p-4 border-t border-base-200 bg-base-100 flex items-center gap-2">
            {/* Direct Image File Upload Button */}
            <button
              onClick={() => imageFileRef.current?.click()}
              disabled={uploadingChatImage}
              title="Upload Image File directly (Max 1MB)"
              className="btn btn-square btn-ghost btn-sm text-base-content/80 hover:text-primary"
            >
              <FaFileUpload className="text-lg text-primary" />
            </button>

            {/* URL Image Button */}
            <button
              onClick={() => setShowImageInput(!showImageInput)}
              title="Paste Image URL"
              className="btn btn-square btn-ghost btn-sm text-base-content/70 hover:text-primary"
            >
              <FaImage className="text-lg" />
            </button>

            {/* Voice Recorder Button */}
            {!recording ? (
              <button
                onClick={startRecording}
                title="Record Voice Note"
                className="btn btn-square btn-ghost btn-sm text-base-content/70 hover:text-error"
              >
                <FaMicrophone className="text-lg" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                title="Stop & Send Voice Note"
                className="btn btn-square btn-error btn-sm animate-pulse text-white"
              >
                <FaStop className="text-sm" />
              </button>
            )}

            {uploadingChatImage && (
              <span className="text-xs text-primary font-bold animate-pulse">Uploading image...</span>
            )}

            {recording && (
              <span className="text-xs text-error font-mono font-bold animate-pulse">
                Recording ({recordingTime}s)...
              </span>
            )}

            <input
              type="text"
              placeholder={recording ? "Recording audio note..." : "Type your message..."}
              disabled={recording || uploadingChatImage}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage("text");
              }}
              className="input input-bordered rounded-none border border-base-200 flex-1 font-medium text-sm"
            />

            <button
              onClick={() => handleSendMessage("text")}
              disabled={!textInput.trim() && !imageUrl}
              className="btn btn-primary rounded-none font-bold px-4"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal - Fully Responsive on Mobile */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-base-100 p-2 border border-base-300 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute top-3 right-3 btn btn-square btn-sm bg-black text-white hover:bg-red-600 border-none font-bold z-20"
            >
              <FaTimes />
            </button>

            <img
              src={previewModalImage}
              alt="Enlarged chat image preview"
              className="w-full h-auto max-w-full max-h-[80vh] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

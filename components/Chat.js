import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Send a text message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName || auth.currentUser.email,
      userId: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL || "https://via.placeholder.com/40",
      type: "text",
    });

    setNewMessage("");
  };

  // Delete a message
  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "messages", id));
  };

  // Handle image upload for sending chat photos using Cloudinary
  const handleImageMessageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Cloudinary API details
    const cloudName = "dmlttdgsk";
    const uploadPreset = "chat_profile_pics"; // You can use the same preset or create a separate one for chat images

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "chat-app/chat-images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      const imageUrl = data.secure_url;

      // Create a new chat message with the uploaded image URL
      await addDoc(collection(db, "messages"), {
        text: "", // Optionally, add a caption if desired
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName || auth.currentUser.email,
        userId: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL || "https://via.placeholder.com/40",
        type: "image",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-xl mt-10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-teal-400 p-4 text-white font-bold text-lg text-center">
        Chat Room
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800 text-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 p-3 rounded-lg shadow-lg w-fit max-w-[70%] ${
              msg.userId === auth.currentUser.uid
                ? "ml-auto bg-blue-500 text-white flex-row-reverse"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            <img
              src={msg.photoURL}
              alt="User"
              className="w-10 h-10 rounded-full border border-gray-500"
            />
            <div>
              <span className="block text-xs font-semibold text-gray-300">
                {msg.user}
              </span>
              {msg.type === "image" ? (
                <img
                  src={msg.imageUrl}
                  alt="Sent content"
                  className="max-w-xs rounded shadow"
                />
              ) : (
                <p className="break-words">{msg.text}</p>
              )}
            </div>
            {msg.userId === auth.currentUser.uid && (
              <button
                onClick={() => deleteMessage(msg.id)}
                className="ml-3 text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Combined input area for text messages and sending photos */}
      <form
        onSubmit={sendMessage}
        className="flex items-center bg-gray-700 p-3 border-t border-gray-600"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-600 text-white placeholder-gray-400"
        />
        <div className="flex gap-3 ml-3">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Send
          </button>
          <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            {uploading ? "Uploading..." : "Send Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageMessageUpload}
              className="hidden"
            />
          </label>
        </div>
      </form>
    </div>
  );
}

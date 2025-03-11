import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName || auth.currentUser.email,
      userId: auth.currentUser.uid,
    });

    setNewMessage("");
  };

  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "messages", id));
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
            className={`p-3 rounded-lg shadow-lg w-fit max-w-[70%] flex justify-between items-center ${
              msg.userId === auth.currentUser.uid
                ? "ml-auto bg-blue-500 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            <div>
              <span className="block text-xs font-semibold text-gray-300">
                {msg.user}
              </span>
              {msg.text}
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
      <form onSubmit={sendMessage} className="flex items-center bg-gray-700 p-3 border-t border-gray-600">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-gray-600 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="ml-3 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}

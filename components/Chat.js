// components/Chat.js
import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import useStore from '../store/useStore';

const Chat = () => {
  const [input, setInput] = useState('');
  const { messages, setMessages } = useStore();

  // Listen for messages in real time
  useEffect(() => {
    const q = query(collection(firestore, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [setMessages]);

  // Send message to Firestore
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addDoc(collection(firestore, 'messages'), {
      text: input,
      createdAt: serverTimestamp(),
      uid: auth.currentUser.uid,
      photoURL: auth.currentUser.photoURL,
    });
    setInput('');
  };

  // Delete a message from Firestore
  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(firestore, 'messages', messageId));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chat Room</h2>
      <div className="border rounded-lg p-4 h-96 overflow-y-scroll bg-white shadow">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4 p-2 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={msg.photoURL}
                  alt="user avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-gray-900">{msg.text}</span>
              </div>
              {msg.uid === auth.currentUser.uid && (
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {msg.createdAt?.seconds 
                ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString() 
                : 'Sending...'}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex">
      <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-r">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

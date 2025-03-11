// src/app/page.js
"use client"
 
import React, { useEffect } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import useStore from '../../store/useStore';
import Login from '../../components/Login';
import Chat from '../../components/Chat';

export default function Home() {
  const { user, setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-teal-400 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Welcome, {user.displayName}</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
        >
          Log Out
        </button>
      </header>
      <Chat />
    </div>
  );
}

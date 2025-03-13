"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import useStore from "../../store/useStore";
import Login from "../../components/Login";
import Chat from "../../components/Chat";
import Profile from "../../components/Profile";

export default function Home() {
  const { user, setUser } = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensures client-side rendering only
  }, []);

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

  // Prevent hydration error by only rendering when mounted
  if (!isMounted) return null;

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-teal-400 p-4 flex justify-between items-center">
  <h1 className="text-2xl font-bold text-white">
    Welcome, {user?.displayName || user?.email?.split("@")[0]}
  </h1>

  {/* Put Profile and Log Out in a row */}
  <div className="flex items-center gap-4">
    <Profile />
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
    >
      Log Out
    </button>
  </div>
</header>

      <Chat />
    </div>
  );
}

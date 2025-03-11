// components/Login.js
import React from 'react';
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useStore from '../store/useStore';

const Login = () => {
  const provider = new GoogleAuthProvider();
  const { setUser } = useStore();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-pink-500">
      <h2 className="text-3xl font-bold text-white mb-6">Sign in to Chat</h2>
      <button 
        onClick={signInWithGoogle} 
        className="bg-white text-purple-600 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;

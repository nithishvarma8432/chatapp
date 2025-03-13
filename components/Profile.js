"use client";
import React, { useState } from "react";
import { auth } from "../firebase/config";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const [profileUploading, setProfileUploading] = useState(false);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileUploading(true);

     
    const cloudName = "dmlttdgsk"; 
    const uploadPreset = "chat_profile_pics"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "chat-app/profile-pictures");

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

      const downloadURL = data.secure_url;
      
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      await auth.currentUser.reload();

      setProfileUploading(false);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setProfileUploading(false);
      alert("Failed to upload. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      
      <img
        src={auth.currentUser?.photoURL || "https://via.placeholder.com/40"}
        alt="Profile"
        className="w-10 h-10 rounded-full border border-gray-300 object-cover"
      />

     
      <label className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
        {profileUploading ? "Uploading..." : "Change"}
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePictureUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
}

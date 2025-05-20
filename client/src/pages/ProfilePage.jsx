import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(localStorage.getItem("name") || "");
    const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
    const [updatedName, setUpdatedName] = useState(name);
    const [updatedEmail, setUpdatedEmail] = useState(email);

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSave = async () => {
        try {
            const res = await axios.put("http://localhost:5050/update-profile", {
                name: updatedName,
                email: updatedEmail,
                userImg: ""
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated = res.data;
            if (updated?.name && updated?.email) {
                localStorage.setItem("name", updated.name);
                localStorage.setItem("userEmail", updated.email);
                setName(updated.name);
                setEmail(updated.email);
                setEditMode(false);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF1E0] px-6 py-10 text-center">
            <h2 className="text-4xl font-playfair text-[#4B2E2B] font-bold mb-8">
                Your Profile
            </h2>

            <div className="max-w-md mx-auto">
                {editMode ? (
                    <div className="space-y-4">
                        <input
                            className="w-full border border-[#D6C1B0] bg-[#FCF7EE] text-[#4B2E2B] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="Enter name"
                        />
                        <input
                            className="w-full border border-[#D6C1B0] bg-[#FCF7EE] text-[#4B2E2B] px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            placeholder="Enter email"
                        />
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleSave}
                                className="bg-[#4A5A40] hover:bg-[#3A4B2D] text-white font-semibold px-4 py-2 rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="bg-[#A67B5B] hover:bg-[#8B6142] text-white font-semibold px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-playfair font-semibold text-[#4B2E2B] mb-1">{name}</h3>
                        <p className="text-[#6B4E3D] mb-4">{email}</p>
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-[#D6A35D] hover:bg-[#C28B3B] text-white font-semibold px-4 py-2 rounded"
                        >
                            Edit Profile
                        </button>
                    </>
                )}

                <hr className="my-6 border-[#E6D3C2]" />

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

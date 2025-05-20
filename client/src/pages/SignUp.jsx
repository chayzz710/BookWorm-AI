import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:5050/signup", { name, email, password })
            .then(result => {
                console.log(result);
                navigate("/");
            })
            .catch(err => {
                console.error(err);
                alert("Error registering user.");
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#FAF1E0]">
            <div className="bg-[#FCF7EE] border border-[#E6D3C2] p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-3xl font-playfair text-[#4B2E2B] font-bold mb-6 text-center">
                    Join Bookworm AI ✨
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4B2E2B] mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full border border-[#D6C1B0] px-4 py-2 rounded-md bg-[#FDF6EC] text-[#3B2F2F] placeholder:text-[#A1887F]"
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4B2E2B] mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-[#D6C1B0] px-4 py-2 rounded-md bg-[#FDF6EC] text-[#3B2F2F] placeholder:text-[#A1887F]"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#4B2E2B] mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full border border-[#D6C1B0] px-4 py-2 rounded-md bg-[#FDF6EC] text-[#3B2F2F] placeholder:text-[#A1887F]"
                            placeholder="Create a password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#A67B5B] text-white py-2 rounded-md hover:bg-[#8B6142] transition"
                    >
                        Register
                    </button>

                    <p className="text-sm text-center mt-4 text-[#6B4E3D]">
                        Already have an account?{" "}
                        <Link to="/" className="text-[#A67B5B] hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

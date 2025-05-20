import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import "@fontsource/playfair-display";

export default function CurrentlyReading() {
    const token = localStorage.getItem("token");
    const [books, setBooks] = useState([]);

    const updateStatus = (id, newStatus) => {
        axios.put(`http://localhost:5050/books/${id}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setBooks((prev) =>
                    prev.map((book) =>
                        book._id === id ? { ...book, status: newStatus } : book
                    )
                );
            })
            .catch(err => {
                console.error("Failed to update status:", err);
                alert("Status update failed");
            });
    };

    const deleteBook = (id) => {
        axios.delete(`http://localhost:5050/books/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(() => {
                setBooks((prev) => prev.filter((book) => book._id !== id));
            })
            .catch(err => {
                console.error("❌ Failed to delete book:", err.response?.data || err.message);
                alert("Delete failed. Check console.");
            });
    };


    useEffect(() => {
        axios.get("http://localhost:5050/books?status=reading", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBooks(res.data))
            .catch(err => {
                console.error("Fetch failed:", err);
                alert("Authentication failed. Try logging in again.");
            });
    }, []);

    return (
        <div className="p-6 bg-[#FAF1E0] min-h-screen">
            <h2 className="text-3xl font-playfair text-[#3B2F2F] font-bold flex items-center gap-3 mb-6">
                <FontAwesomeIcon icon={faBookOpen} className="text-[#A67B5B]" />
                Currently Reading
            </h2>

            {books.length === 0 ? (
                <p className="text-[#6B4E3D] text-lg italic">Your list is empty. Add some books!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="bg-[#FCF7EE] rounded-xl shadow-md hover:shadow-lg p-4 border border-[#E6D3C2] transition flex flex-col"
                        >
                            {/* Book Cover */}
                            {book.cover && (
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-full h-48 object-contain rounded-md mb-4 border border-[#D6C1B0] bg-white"
                                />
                            )}

                            {/* Title & Author */}
                            <div className="mb-4">
                                <h3 className="text-lg font-playfair text-[#4B2E2B]">{book.title}</h3>
                                <p className="text-sm italic text-[#6B4E3D]">by {book.author}</p>
                            </div>

                            {/* Status */}
                            {book.status !== "to-read" && (
                                <p className="text-sm text-[#4A5A40] font-medium mb-3">
                                    ✅ Status: {book.status}
                                </p>
                            )}

                            {/* Buttons */}
                            <div className="mt-auto flex flex-wrap gap-2">
                                <button
                                    onClick={() => updateStatus(book._id, "reading")}
                                    className="bg-[#D6B561] hover:bg-[#C4A447] text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Mark as Reading
                                </button>
                                <button
                                    onClick={() => updateStatus(book._id, "read")}
                                    className="bg-[#4A5A40] hover:bg-[#3C4B33] text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Mark as Read
                                </button>
                                <button
                                    onClick={() => deleteBook(book._id)}
                                    className="bg-[#7B2D26] hover:bg-[#5C1F1B] text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faStar, faCommentDots, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ReadingHistory() {
    const token = localStorage.getItem("token");
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5050/books?status=read", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setBooks(res.data))
            .catch(err => {
                console.error("Fetch failed:", err);
                alert("Authentication failed. Try logging in again.");
            });
    }, []);

    const updateField = (id, field, value) => {
        const token = localStorage.getItem("token");

        // Optimistic update
        setBooks((prev) =>
            prev.map((book) =>
                book._id === id ? { ...book, [field]: value } : book
            )
        );

        // Send full payload to backend
        axios.put(`http://localhost:5050/books/${id}`, {
            [field]: value,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
                console.log("Updated in DB:", res.data);
            })
            .catch(err => {
                console.error("Failed to update book:", err.response?.data || err.message);
                alert("Update failed. Check console.");
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


    return (
        <div className="p-6 bg-[#FAF1E0] min-h-screen">
            <h2 className="text-3xl font-playfair text-[#3B2F2F] font-bold flex items-center gap-3 mb-6">
                <FontAwesomeIcon icon={faClockRotateLeft} className="text-[#A67B5B]" />
                Reading History
            </h2>

            {books.length === 0 ? (
                <p className="text-[#6B4E3D] text-lg italic">You haven't marked any books as read yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div
                            key={book._id || book.id}
                            className="bg-[#FCF7EE] rounded-xl shadow-md hover:shadow-lg p-4 border border-[#E6D3C2] transition flex flex-col"
                        >
                            {/* Cover */}
                            <img
                                src={book.cover}
                                alt={`${book.title} cover`}
                                className="w-full h-48 object-contain rounded-md mb-4 border border-[#D6C1B0] bg-white"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/No_Cover.jpg";
                                }}
                            />

                            <h3 className="text-lg font-playfair text-[#4B2E2B] mb-1">{book.title}</h3>
                            <p className="text-sm italic text-[#6B4E3D] mb-3">by {book.author}</p>

                            {/* Rating */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-[#3B2F2F] mb-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faStar} className="text-[#D6B561]" />
                                    Your Rating
                                </label>
                                <select
                                    value={book.rating ?? ""}
                                    onChange={(e) => updateField(book._id, "rating", parseInt(e.target.value))}
                                    className="w-full px-3 py-1 border border-[#D6C1B0] rounded-md bg-[#FAF1E0] text-[#3B2F2F]"
                                >
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <option key={r} value={r}>
                                            {r} Star{r > 1 && "s"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Comment */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-[#3B2F2F] mb-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCommentDots} className="text-[#A67B5B]" />
                                    Your Comment
                                </label>
                                <textarea
                                    value={book.comment}
                                    onChange={(e) => updateField(book._id, "comment", e.target.value)}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-[#D6C1B0] rounded-md bg-[#FAF1E0] text-[#3B2F2F] resize-none"
                                    placeholder="What did you think of the book?"
                                />
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => deleteBook(book._id)}
                                className="mt-2 bg-[#7B2D26] hover:bg-[#5C1F1B] text-white px-4 py-2 rounded-md w-full text-sm flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                Delete from History
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

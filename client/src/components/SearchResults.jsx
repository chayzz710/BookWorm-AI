import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search).get("q") || "";
}

export default function SearchResults() {
    const query = useQuery();
    const [results, setResults] = useState([]);
    const [userBooks, setUserBooks] = useState([]);
    const API_KEY = import.meta.env.GOOGLE_BOOKS_API_KEY;
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!query || !token) return;

                // 1. Fetch from Google Books API
                const gRes = await axios.get("https://www.googleapis.com/books/v1/volumes", {
                    params: {
                        q: query,
                        key: API_KEY,
                        maxResults: 10,
                    },
                });

                const gBooks = gRes.data.items || [];

                // 2. Fetch user’s saved books from your backend
                const dbRes = await axios.get("http://localhost:5050/books", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userBooks = dbRes.data;

                // 3. Merge to identify already added books
                const merged = gBooks.map((book) => {
                    const id = book.id;
                    const exists = userBooks.find((b) => b.gbookId === id);
                    return {
                        ...book,
                        existsInDb: !!exists,
                        existingStatus: exists?.status || null,
                    };
                });

                setUserBooks(userBooks);
                setResults(merged);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [query, token]);

    const handleAdd = async (book) => {
        try {
            const data = {
                gbookId: book.id,
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors?.[0] || "Unknown",
                cover: book.volumeInfo.imageLinks?.thumbnail || "", // ✅ use `cover` field
                status: "to-read", // default status
                rating: null,
                comment: "",
                dateMarkedToRead: new Date(),
            };

            await axios.post("http://localhost:5050/books", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Optionally: refresh local userBooks state to show updated status
            const updated = [...userBooks, { ...data, gbookId: book.id }];
            setUserBooks(updated);

            const updatedResults = results.map((b) =>
                b.id === book.id ? { ...b, existsInDb: true, existingStatus: "to-read" } : b
            );
            setResults(updatedResults);
        } catch (err) {
            console.error("Error adding book:", err);
        }
    };

    return (
        <div className="flex-grow bg-[#FAF1E0] min-h-screen px-4 py-6 space-y-4">
            {results.map((book) => {
                const info = book.volumeInfo || {};
                const genre =
                    info.mainCategory?.trim() ||
                    (info.categories?.[0]?.split("/").pop().trim()) ||
                    null;

                return (
                    <div
                        key={book.id}
                        className="flex bg-[#FCF7EE] border border-[#E6D3C2] rounded-xl shadow-md hover:shadow-lg transition p-4"
                    >
                        {/* Cover */}
                        <img
                            src={info.imageLinks?.thumbnail || "/default-thumb.jpg"}
                            alt={info.title || "Book"}
                            className="w-28 h-40 object-contain border border-[#D6C1B0] bg-white rounded-md"
                            onError={(e) => { e.target.src = "/assets/No_Cover.jpg"; }}
                        />

                        {/* Info Section */}
                        <div className="ml-4 flex flex-col justify-between w-full">
                            <div>
                                <h4 className="font-playfair text-[#4B2E2B] text-xl font-semibold">
                                    {info.title || "Untitled"}
                                </h4>
                                <p className="text-sm italic text-[#6B4E3D] mb-2">
                                    {info.authors?.join(", ") || "Unknown Author"}
                                </p>

                                {genre && (
                                    <span className="inline-block bg-[#EFE3CF] text-[#4B2E2B] text-xs px-2 py-0.5 rounded-full border border-[#D6C1B0] mb-2">
                                        {genre}
                                    </span>
                                )}

                                {info.infoLink && (
                                    <div>
                                        <a
                                            href={info.infoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#3B2F2F] underline hover:text-[#5C4033] transition"
                                        >
                                            View on Google Books →
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="text-right mt-2">
                                {book.existsInDb ? (
                                    <button
                                        disabled
                                        className="px-3 py-1 bg-[#D6C1B0] text-[#3B2F2F] rounded font-medium text-sm"
                                    >
                                        Already in "{book.existingStatus}"
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAdd(book)}
                                        className="px-3 py-1 bg-[#A67B5B] text-white rounded hover:bg-[#8B6142] text-sm transition"
                                    >
                                        + Add to To-Read
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );


}

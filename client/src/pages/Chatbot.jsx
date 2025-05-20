import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {

    const [messages, setMessages] = useState([{ role: "assistant", "content": "Hi! What would you like to read today?" }]); //default first message
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]); //the list of books suggested.
    const [booksVisible, setBooksVisible] = useState(false); //google books called?



    const handleSend = async () => {

        if (!input.trim()) return; //no input -> return 

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);

        setInput("");
        setLoading(true);
        setBooks([]); // clear previous books when a new query is made
        setBooksVisible(false); // reset before new query

        try {
            const res = await axios.post("http://localhost:5050/recommend", { message: input });
            const reply = res.data.reply;
            const books = res.data.books;
            console.log("Enriched books:", res.data.books);

            const botMsg = { role: "assistant", content: reply.replace(/\*/g, ""), };
            setMessages((prev) => [...prev, botMsg]);
            setBooks(books);
            setBooksVisible(true);
        }

        catch (err) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Oops! Something is wrong!" }])
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex-1 flex flex-col md:flex-row bg-[#FAF1E0] font-sans">

            {/* Left - Book Suggestions Panel */}
            <div className={`overflow-y-auto custom-scroll p-4 bg-[#FAF1E0]
                ${booksVisible ? "w-full md:w-1/3" : "hidden"} 
                max-h-[70vh] md:max-h-full transition-all duration-300`}>

                <h2 className="text-2xl font-serif text-[#3B2F2F] mb-4">Recommended Books</h2>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                    {books.map((book, index) => (
                        <div key={index} className="bg-[#FCF7EE] border border-[#D6C1B0] rounded-xl p-4 shadow-md hover:shadow-xl transition-transform hover:scale-[1.02] flex flex-col justify-between">
                            {book.thumbnail && (
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="w-full h-40 object-contain rounded mb-3"
                                />
                            )}
                            <h3 className="text-lg font-serif text-[#4B2E2B] mb-1">{book.title}</h3>
                            <p className="text-sm italic text-[#6B4E3D] mb-2">by {book.author}</p>
                            <p className="text-sm text-[#5C4B3B] mb-3">{book.description || "No description available."}</p>

                            {book.infoLink && (
                                <a
                                    href={book.infoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#3B2F2F] hover:underline font-medium mb-2"
                                >
                                    View on Google Books →
                                </a>
                            )}

                            <button
                                className="mt-auto bg-[#4B2E2B] text-[#FDF6EC] text-sm py-1 px-3 rounded hover:bg-[#3B2F2F] transition"
                            >
                                + Add to Reading List
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right - Chat Section */}
            <div className={`w-full md:w-2/3 flex flex-col bg-gradient-to-b from-[#FAF1E0] to-[#DCC5B0] 
                ${booksVisible ? "flex-[2]" : "flex-[5]"}`}>

                {/* Messages */}
                <div className={`flex-1 overflow-y-auto custom-scroll p-4 space-y-3 
                ${booksVisible ? "max-h-[50vh] md:max-h-none" : "flex-1"}`}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`inline-block max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow whitespace-pre-wrap break-words font-mono
                            ${msg.role === "user"
                                    ? "bg-[#3B2F2F] text-[#FDF6EC] rounded-br-none"
                                    : "bg-[#EFE3CF] text-[#4B2E2B] rounded-bl-none"

                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 border-t border-[#D6C1B0] bg-[#F8EAD8] flex items-center gap-2">
                    <input
                        className="flex-1 px-4 py-2 text-sm border border-[#D6C1B0] rounded-full bg-[#FDF6EC] text-[#3B2F2F] placeholder:text-[#A1887F] focus:outline-none focus:ring-2 focus:ring-[#A67B5B] font-mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask anything..."
                    />
                    <button
                        className="bg-[#3B2F2F] text-white px-4 py-2 rounded hover:bg-[#2D1E1E] transition"
                        onClick={handleSend}
                        disabled={loading}>
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );

    /*return (
        <div className="h-screen w-screen flex flex-col md:flex-row">

            /* Left - Book Panel
            {booksVisible && (
                <div className={`w-full transition-all duration-500 overflow-y-auto bg-[#F7F2E7]
                    flex-[3] max-h-[70vh] md:w-1/3 md:max-h-full p-4`}>


                    <h2 className="text-xl font-bold mb-4 text-[#3E2723]">Recommended Books</h2>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                        {books.map((book, index) => (
                            <div
                                key={index}
                                className="bg-[#FCF7EE] border border-[#D6C1B0] rounded-2xl shadow-md hover:shadow-xl 
                                            transition-transform hover:scale-[1.03] flex flex-col"
                            >

                                {book.thumbnail && (
                                    <img
                                        src={book.thumbnail}
                                        alt={book.title}
                                        className="w-full h-40 object-contain rounded mb-3" />)}

                                <h3 className="text-base font-semibold text-[#4B2E2B] mb-1">
                                    {book.title}
                                </h3>

                                <p className="text-sm italic text-[#6B4E3D] mb-2">
                                    by {book.author}
                                </p>

                                <p className="text-sm text-[#5C4B3B] line-clamp-4">
                                    {book.description || "No description available."}
                                </p>

                                {book.infoLink && (
                                    <a
                                        href={book.infoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 text-sm text-[#3B2F2F] hover:underline font-medium"
                                    >
                                        View on Google Books →
                                    </a>
                                )}

                            </div>
                        ))}
                    </div>

                </div>
            )}

            {/* Right - Chat Section }
            <div className={`w-full transition-all duration-500 md:w-2/3 flex flex-col 
                        bg-gradient-to-b from-[#FAF1E0] to-[#DCC5B0] overflow-y-auto
                        ${booksVisible ? "flex-[2]" : "flex-[5]"}`}>

                {/* Header }
                <div className="p-4 text-xl font-bold text-[#3B2F2F] tracking-wide">
                    Bookworm AI
                </div>

                {/* Messages }
                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {messages.map((msg, index) => (

                        <div
                            key={index}
                            className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}>

                            <div
                                className={`inline-block max-w-[75%] px-4 py-2 rounded-2xl shadow-md text-sm whitespace-pre-wrap break-words
                                    ${msg.role === "user"
                                        ? "bg-[#3B2F2F] text-[#FDF6EC] rounded-br-none"
                                        : "bg-[#EFE3CF] text-[#4B2E2B] rounded-bl-none"
                                    }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Bar }
                <div className="p-3 border-t border-[#D6C1B0] bg-[#F8EAD8] flex items-center gap-2">

                    <input
                        className="flex-1 px-4 py-2 text-sm border border-[#D6C1B0] rounded-full bg-[#FDF6EC] text-[#3B2F2F] placeholder:text-[#A1887F] focus:outline-none focus:ring-2 focus:ring-[#A67B5B] font-mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask anything..." />

                    <button
                        className="bg-[#4A5A40] text-white px-4 py-2 rounded hover:bg-[#355E7A]"
                        onClick={handleSend}
                        disabled={loading}>

                        {loading ? "..." : "Send"}

                    </button>
                </div>

            </div>



        </div>
    );*/
};

export default Chatbot;


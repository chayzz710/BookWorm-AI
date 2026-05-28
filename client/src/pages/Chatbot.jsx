import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStop } from "@fortawesome/free-solid-svg-icons";

const API_URL = import.meta.env.VITE_API_URL;

// ── Web Speech API voice input hook ──────────────────────────────────────────
function useVoiceInput({ onTranscript, onError }) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const supported = typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

    const startListening = () => {
        if (!supported) {
            onError("Your browser doesn't support voice input. Try Chrome.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = "en-US";
        recognition.interimResults = false; // final results only
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        recognition.onstart = () => setListening(true);

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            onTranscript(transcript);
        };

        recognition.onerror = (e) => {
            if (e.error !== "aborted") {
                onError(`Voice error: ${e.error}`);
            }
            setListening(false);
        };

        recognition.onend = () => setListening(false);

        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setListening(false);
    };

    return { listening, startListening, stopListening, supported };
}
// ─────────────────────────────────────────────────────────────────────────────

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! What would you like to read today?" },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [booksVisible, setBooksVisible] = useState(false);
    const [voiceError, setVoiceError] = useState("");
    const messagesEndRef = useRef(null);

    const token = localStorage.getItem("token");

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Voice hook — when transcript arrives, fill input and auto-send
    const { listening, startListening, stopListening, supported } = useVoiceInput({
        onTranscript: (text) => {
            setInput(text);
            // Small delay so the user can see what was heard before sending
            setTimeout(() => handleSendText(text), 400);
        },
        onError: (msg) => {
            setVoiceError(msg);
            setTimeout(() => setVoiceError(""), 4000);
        },
    });

    const handleMicClick = () => {
        if (listening) stopListening();
        else startListening();
    };

    const handleAddBook = async (book) => {
        try {
            await axios.post(
                `${API_URL}/books`,
                {
                    gbookId: book.infoLink,
                    title: book.title,
                    author: book.author,
                    cover: book.thumbnail || "",
                    status: "to-read",
                    rating: null,
                    comment: "",
                    dateMarkedToRead: new Date(),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`"${book.title}" added to your reading list!`);
        } catch (err) {
            console.error("Add book error:", err);
            alert("Could not add book. Are you logged in?");
        }
    };

    // Separated so the voice handler can call it with the transcript directly
    const handleSendText = async (text) => {
        const trimmed = text?.trim();
        if (!trimmed) return;

        const userMsg = { role: "user", content: trimmed };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        setBooks([]);
        setBooksVisible(false);

        try {
            const history = messages.slice(-8);
            const res = await axios.post(`${API_URL}/recommend`, {
                message: trimmed,
                history,
            });

            const reply = res.data.reply;
            const receivedBooks = res.data.books;

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: reply.replace(/\*/g, "") },
            ]);
            setBooks(receivedBooks);
            setBooksVisible(true);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops! Something went wrong." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => handleSendText(input);

    return (
        <div className="h-full flex-1 flex flex-col md:flex-row bg-[#FAF1E0] font-sans">

            {/* Left - Book Suggestions Panel */}
            <div
                className={`overflow-y-auto custom-scroll p-4 bg-[#FAF1E0]
                    ${booksVisible ? "w-full md:w-1/3" : "hidden"}
                    max-h-[70vh] md:max-h-full transition-all duration-300`}
            >
                <h2 className="text-2xl font-serif text-[#3B2F2F] mb-4">Recommended Books</h2>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                    {books.map((book, index) => (
                        <div
                            key={index}
                            className="bg-[#FCF7EE] border border-[#D6C1B0] rounded-xl p-4 shadow-md hover:shadow-xl transition-transform hover:scale-[1.02] flex flex-col justify-between"
                        >
                            {book.thumbnail && (
                                <img
                                    src={book.thumbnail}
                                    alt={book.title}
                                    className="w-full h-40 object-contain rounded mb-3"
                                />
                            )}
                            <h3 className="text-lg font-serif text-[#4B2E2B] mb-1">{book.title}</h3>
                            <p className="text-sm italic text-[#6B4E3D] mb-2">by {book.author}</p>
                            <p className="text-sm text-[#5C4B3B] mb-3">
                                {book.description || "No description available."}
                            </p>
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
                                onClick={() => handleAddBook(book)}
                                className="mt-auto bg-[#4B2E2B] text-[#FDF6EC] text-sm py-1 px-3 rounded hover:bg-[#3B2F2F] transition"
                            >
                                + Add to Reading List
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right - Chat Section */}
            <div
                className={`w-full md:w-2/3 flex flex-col bg-gradient-to-b from-[#FAF1E0] to-[#DCC5B0]
                    ${booksVisible ? "flex-[2]" : "flex-[5]"}`}
            >
                {/* Messages */}
                <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`inline-block max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow whitespace-pre-wrap break-words font-mono
                                    ${msg.role === "user"
                                        ? "bg-[#3B2F2F] text-[#FDF6EC] rounded-br-none"
                                        : "bg-[#EFE3CF] text-[#4B2E2B] rounded-bl-none"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator while waiting */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-[#EFE3CF] text-[#4B2E2B] px-4 py-2 rounded-2xl rounded-bl-none text-sm font-mono animate-pulse">
                                Finding books…
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Voice error toast */}
                {voiceError && (
                    <div className="mx-3 mb-1 bg-red-100 border border-red-300 text-red-700 text-xs px-3 py-1.5 rounded">
                        {voiceError}
                    </div>
                )}

                {/* Listening indicator */}
                {listening && (
                    <div className="mx-3 mb-1 flex items-center gap-2 text-sm text-[#4B2E2B] bg-[#F8EAD8] border border-[#D6C1B0] px-3 py-1.5 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
                        Listening… speak now
                    </div>
                )}

                {/* Input Bar */}
                <div className="p-3 border-t border-[#D6C1B0] bg-[#F8EAD8] flex items-center gap-2">
                    <input
                        className="flex-1 px-4 py-2 text-sm border border-[#D6C1B0] rounded-full bg-[#FDF6EC] text-[#3B2F2F] placeholder:text-[#A1887F] focus:outline-none focus:ring-2 focus:ring-[#A67B5B] font-mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={listening ? "Listening…" : "Ask anything, or tap the mic…"}
                    />

                    {/* Mic button — only shown if browser supports Web Speech API */}
                    {supported && (
                        <button
                            onClick={handleMicClick}
                            title={listening ? "Stop listening" : "Speak your request"}
                            className={`px-3 py-2 rounded-full border transition-colors
                                ${listening
                                    ? "bg-red-500 border-red-500 text-white animate-pulse"
                                    : "bg-[#FDF6EC] border-[#D6C1B0] text-[#3B2F2F] hover:bg-[#DCC5B0]"
                                }`}
                        >
                            <FontAwesomeIcon icon={listening ? faStop : faMicrophone} />
                        </button>
                    )}

                    <button
                        className="bg-[#3B2F2F] text-white px-4 py-2 rounded-full hover:bg-[#2D1E1E] transition disabled:opacity-50"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                    >
                        {loading ? "…" : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;

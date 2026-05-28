import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBook, faMicrophone, faStop } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
    const [query, setQuery] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [micError, setMicError] = useState("");
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    useEffect(() => {
        if (!location.pathname.startsWith("/search")) {
            setQuery("");
        }
    }, [location]);

    // --- Voice Search ---
    const startRecording = async () => {
        setMicError("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Pick a MIME type the browser actually supports
            const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg"].find(
                (m) => MediaRecorder.isTypeSupported(m)
            ) || "";

            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                // Stop all tracks to release the mic indicator
                stream.getTracks().forEach((t) => t.stop());

                const blob = new Blob(audioChunksRef.current, {
                    type: mimeType || "audio/webm",
                });

                try {
                    const formData = new FormData();
                    formData.append("audio", blob, "recording.webm");

                    const res = await axios.post(`${API_URL}/transcribe`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });

                    const transcript = res.data.transcript?.trim();
                    if (transcript) {
                        setQuery(transcript);
                        // Auto-fire search after transcript lands
                        navigate(`/search?q=${encodeURIComponent(transcript)}`);
                    } else {
                        setMicError("Couldn't hear anything — try again.");
                    }
                } catch (err) {
                    console.error("Transcription error:", err);
                    setMicError("Voice search failed. Check your Deepgram key.");
                }

                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic access error:", err);
            setMicError("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <header className="h-16 w-full bg-[#3B2F2F] shadow flex items-center justify-end px-6 z-10">
            <form onSubmit={handleSubmit} className="flex w-full max-w-lg items-center gap-1">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="flex-grow border border-[#D6C1B0] rounded-l-md px-4 py-2 text-sm
                        text-[#3B2F2F] bg-[#FAF1E0] placeholder-[#A1887F]
                        focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Voice Search Button */}
                <button
                    type="button"
                    onClick={handleMicClick}
                    title={isRecording ? "Stop recording" : "Search by voice"}
                    className={`px-3 py-2 border-y border-[#D6C1B0] transition-colors
                        ${isRecording
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-[#FDF6EC] hover:bg-[#DCC5B0] text-[#3B2F2F]"
                        }`}
                >
                    <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
                </button>

                {/* Search Submit Button */}
                <button
                    type="submit"
                    className="bg-[#FDF6EC] hover:bg-[#DCC5B0] group px-4 py-2 rounded-r-md text-sm border border-[#D6C1B0] border-l-0"
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-[#3B2F2F] group-hover:text-[#4B2E2B]"
                    />
                </button>
            </form>

            {/* Mic error toast */}
            {micError && (
                <div className="absolute top-16 right-6 bg-red-100 border border-red-300 text-red-700 text-xs px-3 py-1.5 rounded shadow z-50">
                    {micError}
                    <button className="ml-2 font-bold" onClick={() => setMicError("")}>✕</button>
                </div>
            )}
        </header>
    );
}

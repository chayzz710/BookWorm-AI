import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBook } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    //handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    //returning the input value to null if the pointer is not on search page
    useEffect(() => {
        if (!location.pathname.startsWith("/search")) {
            setQuery("");
        }
    }, [location]);

    return (
        <header className="h-16 w-full bg-[#3B2F2F] shadow flex items-center justify-end px-6 z-10">
            <form onSubmit={handleSubmit} className="flex w-full max-w-lg">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="flex-grow border border-[#D6C1B0] rounded-l-md px-4 py-2 text-sm 
                 text-[#3B2F2F] bg-[#FAF1E0] placeholder-[#A1887F] 
                 focus:outline-none focus:ring-2 focus:ring-[#A67B5B]"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-[#FDF6EC] hover:bg-[#DCC5B0] group px-4 py-2 rounded-r-md text-sm"
                >
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-[#3B2F2F] group-hover:text-[#4B2E2B]"
                    />
                </button>
            </form>
        </header>

    );
}

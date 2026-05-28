//SideBar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from 'react'
import { faBook, faHouse, faBookmark, faBookOpen, faClockRotateLeft, faChartBar, faUser, faFeatherPointed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fontsource/playfair-display";

export default function Sidebar() {

    const location = useLocation();
    const isHome = location.pathname === "/home";
    const [hovered, setHovered] = useState(false);
    const sidebarWidth = isHome ? "w-64" : hovered ? "w-64" : "w-16";
    const showLabels = isHome || hovered;

    const linkClass = "flex items-center gap-2 text-sm hover:text-[#FDF6EC] transition";

    return (
        <div
            className={`h-screen bg-[#3B2F2F] text-[#FDF6EC] transition-all duration-300 ${sidebarWidth} 
                  overflow-hidden px-4 py-6`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >

            {/* Sidebar top — logo + title */}
            <div className="mb-8 px-1">
                {showLabels ? (
                    <div className="flex items-center gap-2 text-lg font-bold font-serif tracking-wide">
                        <FontAwesomeIcon icon={faBook} className="text-[#FDF6EC]" />
                        <span className="font-[Playfair Display] text-[#FDF6EC]">Bookworm AI</span>
                    </div>
                ) : (
                    <FontAwesomeIcon icon={faBook} className="text-xl text-[#FDF6EC]" />
                )}
            </div>

            <ul className="space-y-5">
                <li>
                    <Link to="/home" className={linkClass}>
                        <FontAwesomeIcon icon={faHouse} />
                        {showLabels && "Home"}
                    </Link>
                </li>
                <li>
                    <Link to="/toread" className={linkClass}>
                        <FontAwesomeIcon icon={faBookmark} />
                        {showLabels && "To Read"}
                    </Link>
                </li>
                <li>
                    <Link to="/current" className={linkClass}>
                        <FontAwesomeIcon icon={faBookOpen} />
                        {showLabels && "Currently Reading"}
                    </Link>
                </li>
                <li>
                    <Link to="/history" className={linkClass}>
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                        {showLabels && "History"}
                    </Link>
                </li>
                <li>
                    <Link to="/statistics" className={linkClass}>
                        <FontAwesomeIcon icon={faChartBar} />
                        {showLabels && "Statistics"}
                    </Link>
                </li>
                <li>
                    <Link to="/profilepage" className={linkClass}>
                        <FontAwesomeIcon icon={faUser} />
                        {showLabels && "Profile"}
                    </Link>
                </li>
                <li>
                    <Link to="/chatbot" className={linkClass}>
                        <FontAwesomeIcon icon={faFeatherPointed} />
                        {showLabels && "Assistant"}
                    </Link>
                </li>
            </ul>
        </div>
    );
}

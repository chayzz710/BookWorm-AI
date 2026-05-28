//MainLayOUt.jsx
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";

// export default function MainLayout() {
//     return (
//         <div className="flex">
//             <Sidebar />
//             <main className="flex-grow p-6">
//                 <Outlet />
//             </main>
//         </div>
//     );
// }

import React, { useState } from 'react'
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SearchResults from "./SearchResults";

export default function MainLayout({ setSearchQuery }) {
    const [searchQuery, setQuery] = useState("");
    const userEmail = localStorage.getItem("userEmail");

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-grow">
                <Header onSearch={setQuery} />
                <main className="flex-grow bg-gray-100 overflow-y-auto">
                    {searchQuery && <SearchResults query={searchQuery} userEmail={userEmail} />}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


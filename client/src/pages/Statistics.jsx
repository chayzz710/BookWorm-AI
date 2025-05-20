import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook, faBookOpen, faBookmark, faCalendarWeek, faCalendarAlt,
    faPlusSquare, faClock, faStar, faList
} from "@fortawesome/free-solid-svg-icons";

export default function StatisticsPage() {
    const [stats, setStats] = useState({
        total: 0,
        read: 0,
        reading: 0,
        toRead: 0,
        weeklyRead: 0,
        monthlyRead: 0,
        addedThisWeek: 0,
        avgCompletionTime: 0,
        mostReadGenre: "-",
        genreBreakdown: {},
        avgRating: 0,
        topRated: [],
        highestRated: null,
        lowestRated: null
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:5050/books", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const books = res.data;
                const now = new Date();

                const readBooks = books.filter(b => b.status === "read");
                const reading = books.filter(b => b.status === "reading").length;
                const toRead = books.filter(b => b.status === "to-read").length;

                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 7);

                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);

                const weeklyRead = readBooks.filter(b => new Date(b.dateCompleted) >= oneWeekAgo).length;
                const monthlyRead = readBooks.filter(b => new Date(b.dateCompleted) >= oneMonthAgo).length;
                const addedThisWeek = books.filter(b => new Date(b.dateMarkedToRead) >= oneWeekAgo).length;

                let totalDays = 0, count = 0;
                for (let book of readBooks) {
                    if (book.dateStarted && book.dateCompleted) {
                        const start = new Date(book.dateStarted);
                        const end = new Date(book.dateCompleted);
                        const diff = (end - start) / (1000 * 60 * 60 * 24);
                        if (diff >= 0) {
                            totalDays += diff;
                            count++;
                        }
                    }
                }
                const avgCompletionTime = count ? (totalDays / count).toFixed(1) : 0;

                const genreCount = {};
                readBooks.forEach(b => {
                    const genre = b.genre || "Unknown";
                    genreCount[genre] = (genreCount[genre] || 0) + 1;
                });
                const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
                const mostReadGenre = sortedGenres[0]?.[0] || "-";

                const ratedBooks = readBooks.filter(b => typeof b.rating === "number");
                const avgRating = ratedBooks.length ? (
                    ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
                ).toFixed(2) : 0;

                const topRated = ratedBooks.filter(b => b.rating >= 4.5)
                    .sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted))
                    .slice(0, 3);

                const highestRated = ratedBooks.length ? ratedBooks.reduce((a, b) => a.rating > b.rating ? a : b) : null;
                const lowestRated = ratedBooks.length ? ratedBooks.reduce((a, b) => a.rating < b.rating ? a : b) : null;

                setStats({
                    total: books.length,
                    read: readBooks.length,
                    reading,
                    toRead,
                    weeklyRead,
                    monthlyRead,
                    addedThisWeek,
                    avgCompletionTime,
                    mostReadGenre,
                    genreBreakdown: genreCount,
                    avgRating,
                    topRated,
                    highestRated,
                    lowestRated
                });
            } catch (err) {
                console.error("Failed to fetch statistics", err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-6 max-w-full mx-auto bg-[#FAF1E0] shadow-inner rounded-lg border border-[#E6D3C2]">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-center text-[#4B2E2B]">
                <FontAwesomeIcon icon={faList} className="mr-2" />
                Reading Statistics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center mb-10">
                <StatCard label="Total Books" value={stats.total} icon={faBook} />
                <StatCard label="Books Read" value={stats.read} icon={faBookOpen} />
                <StatCard label="Currently Reading" value={stats.reading} icon={faBookmark} />
                <StatCard label="To Read" value={stats.toRead} icon={faBookmark} />
                <StatCard label="Read This Week" value={stats.weeklyRead} icon={faCalendarWeek} />
                <StatCard label="Read This Month" value={stats.monthlyRead} icon={faCalendarAlt} />
                <StatCard label="Books Added This Week" value={stats.addedThisWeek} icon={faPlusSquare} />
                <StatCard label="Avg Completion Time" value={`${stats.avgCompletionTime} days`} icon={faClock} />
                <StatCard label="Most Read Genre" value={stats.mostReadGenre} icon={faBookOpen} />
                <StatCard label="Avg Rating Given" value={stats.avgRating} icon={faStar} />
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-[#4B2E2B]">
                    <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                    Genre Breakdown
                </h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.genreBreakdown).map(([genre, count]) => (
                        <span
                            key={genre}
                            className="bg-[#EFE3CF] border border-[#D6C1B0] px-3 py-1 rounded-full text-sm text-[#4B2E2B]"
                        >
                            {genre} — {count}
                        </span>
                    ))}
                </div>
            </div>

            {stats.topRated.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-[#4B2E2B]">
                        <FontAwesomeIcon icon={faStar} className="mr-2" />
                        Top 3 Most Liked Books
                    </h3>
                    <ul className="list-decimal pl-6 text-[#5B3E0D]">
                        {stats.topRated.map((book, idx) => (
                            <li key={idx}><strong>{book.title}</strong> ({book.rating}/5)</li>
                        ))}
                    </ul>
                </div>
            )}

            {stats.highestRated && (
                <p className="text-[#4B2E2B] mb-2">
                    Highest Rated: <strong>{stats.highestRated.title}</strong> ({stats.highestRated.rating}/5)
                </p>
            )}
            {stats.lowestRated && (
                <p className="text-[#4B2E2B]">
                    Lowest Rated: <strong>{stats.lowestRated.title}</strong> ({stats.lowestRated.rating}/5)
                </p>
            )}
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-[#FCF7EE] p-4 rounded shadow text-[#4B2E2B] border border-[#E6D3C2]">
            <FontAwesomeIcon icon={icon} className="text-xl mb-2" />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm">{label}</div>
        </div>
    );
}

const express = require("express"); //to handle API routes like /recommend
const cors = require("cors"); //react (5173) can access port 5000
const dotenv = require("dotenv"); //accesses the .env file
const { GoogleGenerativeAI } = require("@google/generative-ai"); //so we can talk to gemini obviosly
const axios = require("axios");

dotenv.config(); // loads .env file

const app = express(); //creates the server
app.use(cors()); //allow react frontend to access the server
app.use(express.json()); // automatically parse the incoming json

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const googleBooks = process.env.GOOGLE_BOOKS_API_KEY;

//to get any number of book recommendations. by default 3.
const getNumberOfBooks = (message) => {
    const match = message.match(/(?:\b|suggest\s*)(\d+)\s*(?:books?|titles?)/i);
    return match ? parseInt(match[1]) : 3;
};

const enrichBookData = async ({ title, author }) => {
    const query = `${title} ${author}`.replace(/[^\w\s]/gi, "");
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${googleBooks}`;

    console.log("Google Books Query URL:", url);

    try {
        const response = await axios.get(url);
        const items = response.data.items;

        if (items && items.length > 0) {
            const volume = items[0].volumeInfo;

            return {
                title,
                author,
                description: volume.description || "No description available",
                thumbnail: volume.imageLinks?.thumbnail || "",
                infoLink: volume.infoLink || "",
            };
        } else {
            return { title, author, description: "No data found", thumbnail: "", infoLink: "" };
        }
    } catch (err) {
        console.error("Google Books API error:", err.message);
        return { title, author, description: "Error fetching data", thumbnail: "", infoLink: "" };
    }
};

app.post("/recommend", async (req, res) => {
    const { message } = req.body;
    console.log("Received message:", message);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Model loaded");

        const numBooks = getNumberOfBooks(message);
        const prompt = `Suggest exactly ${numBooks} book titles for: "${message}" with author names. Respond like a friendly virtual librarian. Do not include Bonus picks`;
        console.log("Prompt:", prompt);

        const result = await model.generateContent([prompt]);
        console.log("Result:", result);

        const response = await result.response.text();
        console.log("Gemini response:", response);

        // 1. Extract titles and authors
        const extractBooks = (text) => {
            const lines = text.split("\n").filter(l => l.trim().length > 0);
            const books = [];

            for (const line of lines) {
                const cleanLine = line
                    .replace(/^\d+\.\s*/, "")           // remove leading "1. ", "2. " etc.
                    .replace(/[*_]{1,2}/g, "")          // remove *, **, _, or __
                    .replace(/["']/g, "")               // remove quotes
                    .trim();
                console.log("Cleaned line:", cleanLine);

                // Match everything up to ' by ' and everything after that till dash or end
                let match = cleanLine.match(/^(.+?)\s+by\s+([^–—:\n]+)(?:\s+[–—:].*)?$/i);

                // Secondary fallback: "Title — Author" or "Title - Author"
                if (!match) {
                    match = cleanLine.match(/^(.+?)\s+[–—-]\s+(.+)$/);
                }

                // Tertiary fallback: Split by colon (rare)
                if (!match) {
                    match = cleanLine.match(/^(.+?):\s+(.+)$/);
                }

                if (match) {
                    books.push({
                        title: match[1].trim(),
                        author: match[2].trim()
                    });
                } else {
                    console.warn("No match found for line:", cleanLine); // DEBUG
                }
            }

            return books;
        };

        const books = extractBooks(response);
        console.log("Extracted books:", books);

        const enrichedBooks = await Promise.all(books.map(enrichBookData));
        console.log("Enriched books:", enrichedBooks);

        res.json({ reply: response, books: enrichedBooks });
    } catch (error) {
        console.error("Gemini error:", error.message);
        console.error(error);
        res.status(500).json({ reply: "Sorry, something went wrong with Gemini." });
    }
});


const PORT = 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



// work on the parsing. understand it.
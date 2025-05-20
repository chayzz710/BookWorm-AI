const axios = require("axios"); //makes http requests

const googleBooks = process.env.GOOGLE_BOOKS_API_KEY;

async function googleBookData({ title, author }) {
    const query = `${title} ${author}`.replace(/[^\w\s]/gi, "");
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${googleBooks}`;

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
        }
        return { title, author, description: "No data found", thumbnail: "", infoLink: "" };
    } catch (err) {
        console.error("Google Books API error:", err.message);
        return { title, author, description: "Error fetching data", thumbnail: "", infoLink: "" };
    }
}

module.exports = googleBookData;

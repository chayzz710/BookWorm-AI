const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleBookData = require("./googleBook");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//check this again - how does it match with "want, give, etc"?
//so it apparently needs the phrase n books 
const getNumberOfBooks = (message) => {
    const match = message.match(/(?:\b|suggest\s*)(\d+)\s*(?:books?|titles?)/i);
    return match ? parseInt(match[1]) : 3;
};

//this is the parsing logic
const extractBooks = (text) => {
    const lines = text.split("\n").filter(l => l.trim());
    const books = [];

    for (const line of lines) {
        const cleanLine = line
            .replace(/^\d+\.\s*/, "")
            .replace(/[*_]{1,2}/g, "")
            .replace(/["']/g, "")
            .trim();

        let match = cleanLine.match(/^(.+?)\s+by\s+([^–—:\n]+)(?:\s+[–—:].*)?$/i)
            || cleanLine.match(/^(.+?)\s+[–—-]\s+(.+)$/)
            || cleanLine.match(/^(.+?):\s+(.+)$/);

        if (match) {
            books.push({ title: match[1].trim(), author: match[2].trim() });
        }
    }

    return books;
};

async function getBookRecommendations(message) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const numBooks = getNumberOfBooks(message);
    const prompt = `Suggest exactly ${numBooks} book titles for: "${message}" with author names. Respond like a friendly virtual librarian. Do not include Bonus picks`;

    const result = await model.generateContent([prompt]);
    const responseText = await result.response.text();

    const books = extractBooks(responseText);
    const googleBooks = await Promise.all(books.map(googleBookData));

    return { reply: responseText, books: googleBooks };
    //now we got the books andd goog book data
}

module.exports = { getBookRecommendations };

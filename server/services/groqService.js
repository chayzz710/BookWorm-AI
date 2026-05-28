const Groq = require("groq-sdk");
const googleBookData = require("./googleBook");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getNumberOfBooks = (message) => {
    const match = message.match(/(?:\b|suggest\s*)(\d+)\s*(?:books?|titles?)/i);
    return match ? parseInt(match[1]) : 3;
};

const extractBooks = (text) => {
    const lines = text.split("\n").filter((l) => l.trim());
    const books = [];

    for (const line of lines) {
        const cleanLine = line
            .replace(/^\d+\.\s*/, "")
            .replace(/[*_]{1,2}/g, "")
            .replace(/['"]/g, "")
            .trim();

        let match =
            cleanLine.match(/^(.+?)\s+by\s+([^–—:\n]+)(?:\s+[–—:].*)?$/i) ||
            cleanLine.match(/^(.+?)\s+[–—-]\s+(.+)$/) ||
            cleanLine.match(/^(.+?):\s+(.+)$/);

        if (match) {
            books.push({ title: match[1].trim(), author: match[2].trim() });
        }
    }

    return books;
};

async function getBookRecommendations(message, history = []) {
    const numBooks = getNumberOfBooks(message);

    // Build messages array for Groq's chat completions format
    // System prompt sets the librarian persona
    const systemPrompt =
        "You are a friendly, knowledgeable virtual librarian. " +
        "When asked for book recommendations, always list books in the format: " +
        "\"Title by Author\" — one per line, numbered. Do not include bonus picks or extra commentary after the list.";

    // Map history into Groq's { role, content } format
    const historyMessages = history.slice(-8).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
    }));

    const userPrompt =
        `Suggest exactly ${numBooks} book titles for: "${message}". ` +
        `Include the author for each. Do not include Bonus picks.`;

    const chatMessages = [
        ...historyMessages,
        { role: "user", content: userPrompt },
    ];

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: systemPrompt },
            ...chatMessages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const books = extractBooks(responseText);
    const googleBooks = await Promise.all(books.map(googleBookData));

    return { reply: responseText, books: googleBooks };
}

module.exports = { getBookRecommendations };

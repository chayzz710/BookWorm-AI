const { getBookRecommendations } = require("../services/groqService");

// Fix #6: Accept history[] from the request body
async function handleRecommendation(req, res) {
    const { message, history = [] } = req.body;
    console.log("Received message:", message);
    console.log("History length:", history.length);

    try {
        const result = await getBookRecommendations(message, history);
        res.json(result);
    } catch (error) {
        console.error("Groq error:", error.message);
        res.status(500).json({ reply: "Sorry, something went wrong. Please try again." });
    }
}

module.exports = { handleRecommendation };

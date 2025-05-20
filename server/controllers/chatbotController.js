//handles the response. 
const { getBookRecommendations } = require("../services/geminiService");

async function handleRecommendation(req, res) {
    const { message } = req.body;
    console.log("Received message:", message);

    try {
        const result = await getBookRecommendations(message);
        res.json(result);
    } catch (error) {
        console.error("Gemini error:", error.message);
        res.status(500).json({ reply: "Sorry, something went wrong with Gemini." });
    }
}

module.exports = { handleRecommendation };

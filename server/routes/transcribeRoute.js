const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createClient } = require("@deepgram/sdk");

// Store audio in memory — no disk writes needed
const upload = multer({ storage: multer.memoryStorage() });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
    }

    const deepgramKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramKey) {
        return res.status(500).json({ error: "DEEPGRAM_API_KEY not configured" });
    }

    try {
        const deepgram = createClient(deepgramKey);

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            req.file.buffer,
            {
                model: "nova-2",
                language: "en",
                smart_format: true,
            }
        );

        if (error) {
            console.error("Deepgram error:", error);
            return res.status(500).json({ error: "Transcription failed" });
        }

        const transcript =
            result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

        res.json({ transcript });
    } catch (err) {
        console.error("Transcribe route error:", err.message);
        res.status(500).json({ error: "Transcription service error" });
    }
});

module.exports = router;

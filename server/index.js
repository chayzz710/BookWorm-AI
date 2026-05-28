const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "https://book-worm-ai.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Fix #2: Use MONGODB_URI env var (fallback for local dev only)
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/bookusers";
mongoose.connect(mongoUri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Route imports
const chatbotRoute = require("./routes/chatbotRoute");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const transcribeRoute = require("./routes/transcribeRoute"); // Voice Search

app.use("/books", bookRoutes);
app.use("/", authRoutes);
app.use("/recommend", chatbotRoute);
app.use("/", userRoutes);
app.use("/", transcribeRoute); // Voice Search endpoint

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

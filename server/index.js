//index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bookusers")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Route imports
const chatbotRoute = require("./routes/chatbotRoute");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/books", bookRoutes);
app.use("/", authRoutes);       // Login/Register
app.use("/recommend", chatbotRoute); // Gemini AI Bookbot
app.use("/", userRoutes);

// app.use((req, res, next) => {
//     console.log(`Incoming request: ${req.method} ${req.url}`);
//     next();
// });


const PORT = 5050;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

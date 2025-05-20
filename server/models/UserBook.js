// models/UserBook.js
const mongoose = require("mongoose");

const UserBookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

    title: String,
    author: String,
    cover: String, // optional for now

    status: {
        type: String,
        enum: ["to-read", "reading", "read"],
        default: "to-read"
    },

    rating: { type: Number, min: 1, max: 5 }, // can number be decimal too?
    comment: String,

    dateMarkedToRead: Date,  // when status set to "to-read"
    dateStarted: Date,       //  when status set to "reading"
    dateCompleted: Date      //  when status set to "read"
});

module.exports = mongoose.model("userbooks", UserBookSchema);


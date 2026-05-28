// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const UserBook = require("../models/UserBook");

// Get books by status (read, reading, to-read)
router.get("/", authenticate, async (req, res) => {
    const { status } = req.query; // optional filter
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const books = await UserBook.find(filter);
    res.json(books);
});

// Add a book to list
router.post("/", authenticate, async (req, res) => {
    const book = await UserBook.create({ ...req.body, userId: req.user.id });
    res.json(book);
});

// Update status/rating/comment
router.put("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const update = { ...req.body };

    // Attach timestamp based on status
    if (status === "to-read") update.dateMarkedToRead = new Date();
    else if (status === "reading") update.dateStarted = new Date();
    else if (status === "read") update.dateCompleted = new Date();

    const book = await UserBook.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        update,
        { new: true }
    );

    if (!book) return res.status(404).json({ error: "Book not found or unauthorized" });

    res.json(book);
});


// Delete a book
router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const result = await UserBook.deleteOne({ _id: id, userId: req.user.id });

    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Book not found or not owned by user" });
    }

    res.json({ success: true });
});


module.exports = router;

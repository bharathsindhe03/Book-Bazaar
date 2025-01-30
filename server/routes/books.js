const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all books
router.get("/", (req, res) => {
  const query = "SELECT * FROM bookdetails";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error retrieving books:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Modify results to convert BLOB image to base64 string
    const booksWithBase64Images = results.map((book) => {
      // Convert the BLOB image to base64
      if (book.image) {
        book.image = book.image.toString("base64");
      }
      return book;
    });

    res.json(booksWithBase64Images); // Send the books with base64 images
  });
});

module.exports = router;

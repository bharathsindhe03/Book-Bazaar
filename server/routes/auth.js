const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Register User
router.post("/register", (req, res) => {
  const { name, email, username, address, phone_number, password } = req.body;
  const query = `INSERT INTO users (name, email, username, address, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [name, email, username, address, phone_number, password], (err, result) => {
    if (err) {
      console.error("Error registering user:", err);
      return res.status(500).json({ error: "Registration failed" });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Login User
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(500).json({ error: "Login failed" });
    }
    
    if (results.length === 1) {
      res.json({ message: "Login successful", userId: results[0].id });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

module.exports = router;

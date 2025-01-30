const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cart", require("./routes/cart"));


// Start server
app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`);
});

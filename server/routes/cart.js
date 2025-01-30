const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add or update book in the cart
router.post("/add", (req, res) => {
  console.log("Cart Update Request:", req.body);

  const { userId, bookId, quantity } = req.body;

  // Check for missing fields
  if (!userId || !bookId || quantity === undefined) {
    return res
      .status(400)
      .json({ error: "Missing userId, bookId, or quantity" });
  }

  // Check if book exists in bookdetails table
  db.query(
    "SELECT * FROM bookdetails WHERE id = ?",
    [bookId],
    (err, results) => {
      if (err) {
        console.error("Database error while checking book:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Book not found" });
      }

      // Check if the book is already in the cart
      db.query(
        "SELECT * FROM cart WHERE user_id = ? AND book_id = ?",
        [userId, bookId],
        (err, cartResults) => {
          if (err) {
            console.error("Database error while checking cart:", err);
            return res.status(500).json({ error: "Database error" });
          }

          if (cartResults.length > 0) {
            // Update quantity if book exists in cart
            if (quantity > 0) {
              db.query(
                "UPDATE cart SET quantity = ?, created_at = NOW() WHERE user_id = ? AND book_id = ?",
                [quantity, userId, bookId],
                (err) => {
                  if (err) {
                    console.error("Database error while updating cart:", err);
                    return res.status(500).json({ error: "Database error" });
                  }
                  res.json({
                    message: "Cart updated",
                    userId,
                    bookId,
                    quantity,
                  });
                }
              );
            } else {
              // Remove book if quantity is 0
              db.query(
                "DELETE FROM cart WHERE user_id = ? AND book_id = ?",
                [userId, bookId],
                (err) => {
                  if (err) {
                    console.error(
                      "Database error while removing from cart:",
                      err
                    );
                    return res.status(500).json({ error: "Database error" });
                  }
                  res.json({ message: "Book removed from cart" });
                }
              );
            }
          } else {
            // Insert new book into cart
            if (quantity > 0) {
              db.query(
                "INSERT INTO cart (user_id, book_id, quantity, created_at) VALUES (?, ?, ?, NOW())",
                [userId, bookId, quantity],
                (err) => {
                  if (err) {
                    console.error("Database error while adding to cart:", err);
                    return res.status(500).json({ error: "Database error" });
                  }
                  res.json({
                    message: "Book added to cart",
                    userId,
                    bookId,
                    quantity,
                  });
                }
              );
            } else {
              res.json({ message: "Invalid quantity value" });
            }
          }
        }
      );
    }
  );
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  console.log("Request to fetch cart for userId:", userId); // Log the userId

  db.query(
    `SELECT c.book_id, c.quantity, b.title, b.author, b.price, b.image
     FROM cart c
     JOIN bookdetails b ON c.book_id = b.id
     WHERE c.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        log.error("Database error while fetching cart items:", err);
        console.error("Database error while fetching cart items:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: `No items found in cart for user ${userId}` });
      }

      const cartItems = results.map((item) => ({
        ...item,
        image: item.image ? item.image.toString("base64") : null,
      }));

      res.json(cartItems);
    }
  );
});

// Remove book from cart
router.delete("/:userId/:bookId", (req, res) => {
  const { userId, bookId } = req.params;

  db.query(
    "DELETE FROM cart WHERE user_id = ? AND book_id = ?",
    [userId, bookId],
    (err) => {
      if (err) {
        console.error("Database error while removing from cart:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Book removed from cart" });
    }
  );
});

router.post("/purchase/:userId", (req, res) => {
  const { userId } = req.params;

  // Step 1: Fetch all cart items for the user
  db.query(
    `SELECT c.book_id
     FROM cart c
     WHERE c.user_id = ?`,
    [userId],
    (err, cartItems) => {
      if (err) {
        console.error("Database error while fetching cart items:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Step 2: Prepare purchase values with just user_id, book_id, and purchase_date
      const purchaseValues = cartItems.map((item) => [
        userId,
        item.book_id,
        new Date(),
      ]);

      // Log purchase values for debugging
      console.log("Purchase values to be inserted:", purchaseValues);

      // Step 3: Insert items into the purchases table
      const purchaseQuery = `
        INSERT INTO purchases (user_id, book_id, purchase_date)
        VALUES ?
      `;

      db.query(purchaseQuery, [purchaseValues], (err) => {
        if (err) {
          console.error(
            "Database error while inserting into purchase table:",
            err
          );
          return res.status(500).json({ error: "Database error" });
        }

        // Step 4: Clear the cart after the purchase is complete
        db.query("DELETE FROM cart WHERE user_id = ?", [userId], (err) => {
          if (err) {
            console.error("Database error while clearing cart:", err);
            return res.status(500).json({ error: "Database error" });
          }

          // Step 5: Respond with success message
          res.json({ message: "Purchase successful, your cart is now empty!" });
        });
      });
    }
  );
});

module.exports = router;

import { useEffect, useState } from "react";
import Animation from "../../Components/Animation/Animation";
import styles from "./Cart.module.css"; // Import the CSS module
import fetchCartItems from "../../Services/HandlefetchCartItems";
import { handlePurchase } from "../../Services/HandlePurchase"; // Correct import for handlePurchase

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetchCartItems(userId, setCartItems, setError, setLoading);
  }, []);

  const handlePurchaseClick = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      handlePurchase(userId); // Pass userId explicitly
    } else {
      alert("User not logged in!");
    }
  };

  if (loading) {
    return <Animation />;
  }

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      <div className={styles["cart-container"]}>
        {error ? (
          <p>{error}</p>
        ) : cartItems.length > 0 ? (
          cartItems.map((book, index) => (
            <div key={index} className={styles["cart-item"]}>
              <img
                src={`data:image/jpeg;base64,${book.image.toString("base64")}`}
                alt={`${book.title} Image`}
              />
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Price: ${book.price}</p>
              <p>Quantity: {book.quantity}</p>
              <p>Total: ${book.price * book.quantity}</p>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <button onClick={handlePurchaseClick}>Buy All</button> // Corrected onClick event
      )}
    </div>
  );
};

export default Cart;

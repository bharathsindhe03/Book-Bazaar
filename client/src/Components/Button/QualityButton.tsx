import { useState, useEffect } from "react";
import axios from "axios";

interface QuantityButtonProps {
  bookId: number;
}

export default function QuantityButton({ bookId }: QuantityButtonProps) {
  const [quantity, setQuantity] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get<
          { book_id: number; quantity: number }[]
        >(`${import.meta.env.VITE_BASE_SERVER_URL}/api/cart/${userId}`);
        const cartItem = response.data.find(
          (item: { book_id: number }) => item.book_id === bookId
        );
        setQuantity(cartItem ? cartItem.quantity : 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (userId) fetchCart();
  }, [userId, bookId]);

  const updateCart = async (newQuantity: number) => {
    try {
      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      if (newQuantity > 0) {
        await axios.post(
          `${import.meta.env.VITE_BASE_SERVER_URL}/api/cart/add`,
          {
            userId,
            bookId,
            quantity: newQuantity,
          }
        );
      } else {
        await axios.delete(
          `${import.meta.env.VITE_BASE_SERVER_URL}/api/cart/${userId}/${bookId}`
        );
      }

      setQuantity(newQuantity);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {quantity === 0 ? (
        <button
          onClick={() => updateCart(1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      ) : (
        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
          <button
            onClick={() => updateCart(quantity - 1)}
            className="text-lg px-3 text-red-500 hover:text-red-700"
          >
            −
          </button>
          <span className="px-4">{quantity}</span>
          <button
            onClick={() => updateCart(quantity + 1)}
            className="text-lg px-3 text-green-500 hover:text-green-700"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

import axios from "axios";
import { CartItem } from "../Interfaces/CartItem"; // Assuming you have a CartItem interface

const fetchCartItems = async (
  userId: string | null,
  setCartItems: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!userId) {
    setError("User not logged in!");
    setLoading(false);
    return;
  }

  try {
    const response = await axios.get<CartItem[]>(
      `${import.meta.env.VITE_BASE_SERVER_URL}/api/cart/${userId}`
    );
    if (response.data.length === 0) {
      setError("Your cart is empty.");
    } else {
      setCartItems(response.data);
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      setError("No items found in cart.");
    } else {
      setError("Error fetching cart items.");
    }
  } finally {
    setLoading(false);
  }
};

export default fetchCartItems;

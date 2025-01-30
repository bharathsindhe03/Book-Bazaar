import axios from "axios";

export async function handlePurchase(userId: string) {
  if (!userId) {
    alert("User not logged in!");
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_SERVER_URL}/api/cart/purchase/${userId}`
    );
    alert("Purchase successful!");
  } catch (error) {
    console.error("Error during purchase:", error);
    alert("Error during purchase.");
  }
}

import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast

// Define the expected structure of the response
interface LoginResponse {
  userId: number; // Assuming the server returns a 'userId' upon successful login
}

export async function HandleLogin(
  username: string,
  password: string,
  navigate: any
) {
  try {
    const response = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_BASE_SERVER_URL}/api/auth/login`,
      { username, password }
    );

    if (response.status === 200) {
      console.log("Login successful:", response.data);
      if (response.data.userId) {
        localStorage.setItem("userId", response.data.userId.toString()); // Store user ID for session
      }
      toast.success("Login successful!"); // Show success toast
      navigate("/"); // Redirect to home page
      return response.data;
    }
  } catch (error) {
    console.error("Login failed:", error);
    toast.error("Invalid credentials. Please try again."); // Show error toast
    return { error: "Invalid credentials" }; // Returning error message
  }
}

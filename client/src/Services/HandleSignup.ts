import axios from "axios";
import { FormData } from "../Interfaces/FormData";

export async function HandleSignup(formData: FormData) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_SERVER_URL}/api/auth/register`,
      formData
    );

    if (response.status === 200) {
        
       // Notify the parent component about success
    } else {
      // In case of failure
    }
  } catch (error) {
    
    console.error("Registration failed:", error);
  }
}

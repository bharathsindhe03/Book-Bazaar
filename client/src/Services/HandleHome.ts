import axios from "axios";

// Modify HandleHome to accept state functions as arguments
export default async function HandleHome(
  setBooks: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  try {
    const response = await axios.get<any[]>(
      `${import.meta.env.VITE_BASE_SERVER_URL}/api/books`
    );
    setBooks(response.data); // Set books data to state
    setLoading(false); // Set loading state to false when done
  } catch (err) {
    setError("Failed to load books."); // Set error message
    setLoading(false); // Set loading state to false even on error
    console.error("Error fetching books:", err);
  }
}

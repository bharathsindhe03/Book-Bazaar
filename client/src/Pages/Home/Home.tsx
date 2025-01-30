import { useEffect, useState } from "react";
import HandleHome from "../../Services/HandleHome";
import styles from "./Home.module.css"; // Importing CSS Module
import Animation from "../../Components/Animation/Animation";
import QualityButton from "../../Components/Button/QualityButton";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    HandleHome(setBooks, setLoading, setError);
  }, []);

  const addToCart = (bookId: number) => {
    console.log(`Book with id ${bookId} added to cart.`);
  };

  if (loading) {
    return <Animation />;
  }

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      {books.length > 0 ? (
        books.map((book) => (
          <div
            key={book.id}
            className={styles.bookmain}
            data-title={book.title}
            data-author={book.author}
            data-price={book.price}
          >
            <img
              src={`data:image/jpeg;base64,${book.image}`}
              alt={`${book.title} Image`}
              className="bookImage"
            />
            <h3 className={styles.bookTitle}>{book.title}</h3>
            <p className={styles.bookAuthor}>{book.author}</p>
            <p className={styles.bookPrice}>${book.price}</p>
            
            <QualityButton bookId={book.id}  />
          </div>
        ))
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
}

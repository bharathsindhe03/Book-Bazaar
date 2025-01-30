import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <a href="/">Home</a>
        <a href="/cart">Cart</a>
        <a href="/login">Login</a>
        <a href="/register">Sign Up</a>
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchBox}
          placeholder="Search..."
        />
        <button className={styles.searchButton}>Search</button>
      </div>
    </nav>
  );
}

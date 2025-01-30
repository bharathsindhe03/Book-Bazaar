import { useState } from "react";
import { HandleLogin } from "../../Services/HandleLogin";
import styles from "./Login.module.css"; // Import styles
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await HandleLogin(username, password, navigate);
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label className={styles.username}>Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className={styles.password}>Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

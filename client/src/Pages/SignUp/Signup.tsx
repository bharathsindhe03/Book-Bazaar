import { useState } from "react";
import { FormData } from "../../Interfaces/FormData";
import { HandleSignup } from "../../Services/HandleSignup";

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    address: "",
    password: "",
    phone_number: "",
  });

  // Handle change for form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await HandleSignup(formData); // Call the signup handler
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <label htmlFor="phone_number">Phone Number:</label>
      <input
        type="text"
        id="phone_number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
      />

      <button type="submit">Register</button>
    </form>
  );
}

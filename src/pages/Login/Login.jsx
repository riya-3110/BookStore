import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Token stored successfully:", token);

      navigate("/home");
    } catch (error) {
      setError(error.response.data.message || "Login Failed !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/images/read.png" alt="read-boy" className="login-img" />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="items">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="items">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button type="submit" disabled={loading} className="login-button">
          {loading ? "Submitting..." : "Login"}
        </button>
        <a href="/signup">Go to SignUp</a>
      </form>
    </div>
  );
};

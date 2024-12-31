import React, { useState } from "react";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      await axios.post("http://localhost:5000/signup", formData);
      console.log("form Data ::", formData);
      navigate("/");
    } catch (error) {
      setError(error.response.data.message || "Registration Failed !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <img src="/images/read.png" alt="read-boy" className="signup-img" />
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
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
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Submitting..." : "SignUp Now"}
        </button>
        <a href="/">Go to login</a>
      </form>
    </div>
  );
};

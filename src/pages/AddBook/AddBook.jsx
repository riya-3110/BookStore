import React, { useState } from "react";
import "./AddBook.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const AddBook = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
  });

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setError("");
      const token = localStorage.getItem("token");
      console.log("retrieved token ::", token);
      if (!token) {
        throw new Error("Authentication Failed !, please login again");
      }
      await axios.post("/books", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/home");
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Adding Book Failed !"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book">
      <div className="add-book-container">
        <h1>Add New Book</h1>
        <form className="add-book-form" onSubmit={handleSubmit}>
          <div className="items">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChanged}
              required
            />
          </div>
          <div className="items">
            <label htmlFor="desc">Description</label>
            <textarea
              type="text"
              name="description"
              id="desc"
              rows="20"
              value={formData.description}
              onChange={handleChanged}
              required
            />
          </div>
          <div className="items">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              name="author"
              id="author"
              value={formData.author}
              onChange={handleChanged}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="add-book-btn" disabled={loading}>
            {loading ? "submitting..." : "Add Book"}
          </button>
        </form>
        <Link to="/home">Go to Home</Link>
      </div>
    </div>
  );
};

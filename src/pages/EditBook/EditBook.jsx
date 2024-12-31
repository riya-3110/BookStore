import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getBookById, updateBookById } from "../../firebaseHelpers";
import "./EditBook.css";

export const EditBook = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // console.log("location ::", location);
  // console.log("location state :: ", location.state);

  useEffect(() => {
    if (location.state) {
      setFormData(location.state);
    } else {
      const fetchBook = async () => {
        try {
          const book = await getBookById(id);
          setFormData({
            title: book.title || "",
            description: book.description || "",
            author: book.author || "",
          });
        } catch (err) {
          setError("Failed to fetch book details.");
        }
      };

      fetchBook();
    }
  }, [id, location.state]);

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateBookById(id, formData);
      navigate("/home");
    } catch (err) {
      setError("Failed to update book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-book">
      <div className="edit-book-container">
        <h1>Edit Book</h1>
        <p>Book Id : {id}</p>
        <form className="edit-book-form" onSubmit={handleSubmit}>
          <div className="items">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title || ""}
              onChange={handleChanged}
              required
            />
          </div>
          <div className="items">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              rows="20"
              value={formData.description || ""}
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
              value={formData.author || ""}
              onChange={handleChanged}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="edit-book-btn" disabled={loading}>
            {loading ? "Submitting..." : "Edit Book"}
          </button>
        </form>
        <Link to="/home">Go to Home</Link>
      </div>
    </div>
  );
};

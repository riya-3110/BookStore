import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./BookDetails.css";
import { getBookById, deleteBookById } from "../../firebaseHelpers";

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const fetchedBook = await getBookById(id);
        setBook(fetchedBook);
      } catch (err) {
        setError("Failed to fetch book details.");
      }
    };

    fetchBook();
  }, [id]);

  const handleEdit = () => {
    if (book) {
      navigate(`/edit-book/${id}`, { state: book });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteBookById(id);
      navigate("/home");
    } catch (error) {
      setError("Failed to delete the book.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-details">
      <h1>Book Details</h1>
      <div className="book-container">
        <p>
          <b>Book Id:</b> {id}
        </p>
        <p>
          <b>Title:</b> {book.title}
        </p>
        <p>
          <b>Description :</b>
          {book.description}
        </p>
        <p>
          <b>Author:</b> {book.author}
        </p>
        <div className="btn-container">
          <button className="edit-btn" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      <Link to="/home">Go to Home</Link>
    </div>
  );
};

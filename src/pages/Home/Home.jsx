import React, { useEffect, useState } from "react";
import "./Home.css";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Home = () => {
  const navigate = useNavigate();

  const [bookData, setBookData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication failed !");
        }
        const response = await axios.get("http://localhost:5000/books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("response::", response?.data?.AllBooks);
        // const books = Object.values(response.data);
        // console.log("type of res::", typeof response.data);
        setBookData(response?.data?.AllBooks);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to Fetch Books"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, []);

  if (loading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div className="error-msg">{error}</div>;
  }
  return (
    <div className="home-container">
      <div className="logo-container">
        <img src="/images/book.png" alt="book-img" className="home-logo" />
        <h1 className="home-title">Book Store</h1>
      </div>
      <div className="card-container">
        {bookData.length > 0 ? (
          bookData.map((book) => {
            /* console.log("Book ID:", book.id);
            console.log("Book Title:", book.title);
            console.log("Book Description:", book.description);
            console.log("Book Author:", book.author); */
            return (
              <Card
                key={book.id}
                id={book.id}
                title={book.title}
                des={book.description}
                author={book.author}
              />
            );
          })
        ) : (
          <div>No Books Available</div>
        )}
      </div>
      <button className="logout-btn" onClick={() => navigate("/")}>
        Logout
      </button>
      <button className="add-btn" onClick={() => navigate("/add-book")}>
        Add new Book
      </button>
    </div>
  );
};

import React from "react";
import "./Card.css";
import { useNavigate } from "react-router-dom";

export const Card = ({ id, title, des, author }) => {
  const navigate = useNavigate();

  // console.log("props :: ", id, title, des, author);
  const handleBookDetails = () => {
    navigate(`/book-details/${id}`, { state: { id, title, des, author } });
  };
  return (
    <div className="card">
      <div className="info-container">
        <p>
          <b>Book Id:</b> {id}
        </p>
        <p>
          <b>Title:</b> {title}
        </p>
        <p>
          <b>Description:</b>
          {des}
        </p>
        <p>
          <b>Author:</b> {author}
        </p>
      </div>
      <button
        title="Here you can update or delete book"
        className="home-btn"
        onClick={handleBookDetails}
      >
        Show in details
      </button>
    </div>
  );
};

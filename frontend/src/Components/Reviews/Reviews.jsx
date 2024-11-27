import React, { useState, useEffect } from 'react';
import { API_URL } from '../../services/api';
import './Review.css';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState('No ratings yet');
  const [hoveredStar, setHoveredStar] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/reviews/${productId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/v1/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, rating, comment }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setUserName('');
      setRating(0);
      setComment('');
      setHoveredStar(null);
      // Refresh reviews
      const reviewsResponse = await fetch(`${API_URL}/api/v1/reviews/${productId}`);
      if (!reviewsResponse.ok) throw new Error(`HTTP error! Status: ${reviewsResponse.status}`);
      const data = await reviewsResponse.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (currentRating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <i
          key={starValue}
          className={`ri-star-${starValue <= (hoveredStar || currentRating) ? 'fill' : 'line'}`}
          style={{ color: starValue <= (hoveredStar || currentRating) ? '#ffc107' : '#ccc', cursor: 'pointer' }}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(null)}
          onClick={() => setRating(starValue)}
          aria-label={`Rate ${starValue} star`}
        ></i>
      );
    });
  };

  const renderReviewStars = (reviewRating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`ri-star-${index < reviewRating ? 'fill' : 'line'}`}
        style={{ color: index < reviewRating ? '#ffc107' : '#ccc' }}
      ></i>
    ));
  };

  return (
    <div className="reviews-section">
      <h3>Customer Reviews</h3>
      <p>Average Rating: {averageRating} / 5</p>
      {reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review._id} className="review-item">
              <div className="review-header">
                <strong>{review.userName}</strong>
                <div className="review-stars">{renderReviewStars(review.rating)}</div>
              </div>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      <h4>Submit Your Review</h4>
      <form onSubmit={submitReview} className="review-form">
        <label htmlFor="userName" className="cursor-pointer">Your Name</label>
        <input
          id="userName"
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          autoComplete='true'
        />
        <span>Rating</span>
        <div className="rating-stars">{renderStars(rating)}</div>
        <label htmlFor="comment" className="cursor-pointer">Your Review</label>
        <textarea
          id="comment"
          placeholder="Write your review here"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="submit-button">Submit Review</button>
      </form>
    </div>
  );
};

export default Reviews;
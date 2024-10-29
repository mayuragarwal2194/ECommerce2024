import React, { useState, useEffect } from 'react';
import { API_URL } from '../../services/api';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState('No ratings yet');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/reviews/${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
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
    try {
      await fetch(`${API_URL}/api/v1/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userName,
          rating,
          comment,
        }),
      });

      setUserName('');
      setRating(1);
      setComment('');
      
      // Fetch the latest reviews
      const response = await fetch(`${API_URL}/api/v1/reviews/${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="reviews-section">
      <h3>Customer Reviews</h3>
      <p>Average Rating: {averageRating}</p>
      {reviews.length > 0 ? (
        <ul className='list-unstyled'>
          {reviews.map((review) => (
            <li key={review._id}>
              <strong>{review.userName}</strong> ({review.rating} / 5)
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      <h4>Submit Your Review</h4>
      <form onSubmit={submitReview}>
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          name='Your Name'
        />
        <select 
          name='rating'
          value={rating} 
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <textarea
          placeholder="Your review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          name='Your Review'
        ></textarea>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default Reviews;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProductReviews, addReview, editReview, deleteReview } from '../../services/api';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useUser } from '../../Context/UserContext';
import ReviewForm from './ReviewForm/ReviewForm';
import ReviewList from './ReviewList/ReviewList';
import './Review.css';

const Reviews = ({ productId, setUserProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState('No ratings yet');
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const { userInfo } = useUser();

  // Fetch reviews on component mount or when productId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(productId);
        setReviews(data.reviews);
        setAverageRating(data.averageRating || 'No ratings yet');
        setTotalReviews(data.totalReviews || 0);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews.');
      }
    };
    fetchReviews();
  }, [productId]);

  const handleWriteReviewClick = () => {
    const token = Cookies.get('authToken');
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setReviewToEdit(null); // Reset editing state
    setShowReviewForm(true); // Show form for new review
  };

  const handleEditReviewClick = (review) => {
    setReviewToEdit(review); // Set review to edit
    setShowReviewForm(true); // Show the form
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this review?');
      if (!confirmDelete) return;

      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review.');
    }
  };

  const handleReviewSubmit = async (reviewData, reviewFiles, setUserProfile, action = 'add') => {
    try {
      if (action === 'add') {
        await addReview(reviewData, reviewFiles, setUserProfile);
        toast.success('Review submitted successfully!');
      } else if (action === 'edit') {
        await editReview(reviewData.reviewId,reviewData,reviewFiles);
        toast.success('Review updated successfully!');
      }

      // Refetch updated reviews
      const data = await getProductReviews(productId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating || 'No ratings yet');
      setTotalReviews(data.totalReviews || 0);

      setShowReviewForm(false); // Close the form
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Error submitting review.');
    }
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
      <p>
        Average Rating: {averageRating} / 5 ({totalReviews} reviews)
      </p>

      {reviews.length > 0 ? (
        <ReviewList
          reviews={reviews}
          renderReviewStars={renderReviewStars}
          handleDeleteReview={handleDeleteReview}
          handleEditReview={handleEditReviewClick}
          userInfo={userInfo}
        />
      ) : (
        <p>No reviews yet.</p>
      )}

      <button
        onClick={handleWriteReviewClick}
        className="write-review-button ff-btn ff-btn-outline-dark text-uppercase text-decoration-none d-inline-block w-75 text-center mb-3"
      >
        Write a Product Review
      </button>

      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onSubmitSuccess={handleReviewSubmit}
          setUserProfile={setUserProfile}
          closeForm={() => setShowReviewForm(false)}
          reviewToEdit={reviewToEdit}
        />
      )}
    </div>
  );
};

export default Reviews;
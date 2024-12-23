import React from 'react';
import { API_URL } from '../../../services/api';

const ReviewList = ({
  reviews,
  renderReviewStars,
  handleDeleteReview,
  handleEditReview,
  userInfo,
}) => {
  return (
    <ul className="reviews-list">
      {reviews.map((review) => (
        <li key={review._id} className="review-item mb-5">
          <div className="d-flex align-items-center gap-3 position-relative">
            {/* User profile picture and name */}
            <img
              src={
                review.userId?.profilePicture
                  ? `${API_URL}/${review.userId.profilePicture}`
                  : '/default-profile.png' // Fallback profile picture
              }
              onError={(e) => (e.target.src = '/default-profile.png')} // Error handler
              width="50px"
              height="50px"
              className="object-cover object-position-top rounded-circle"
              alt={`${review.userId?.username || 'Anonymous'}'s profile`}
            />
            <div className="review-header">
              <strong>{review.userId?.username || 'Anonymous'}</strong>
            </div>

            {/* Action buttons (Edit/Delete) for the review owner */}
            {review.userId?._id === userInfo?._id && (
              <div className="review-actions d-inline-block ms-5">
                <button className="three-dots-btn px-3" aria-label="Review actions">
                  <i className="ri-more-2-line"></i>
                </button>
                <div className="actions-dropdown">
                  <button
                    className="action-btn px-2 mb-1 py-1"
                    onClick={() => handleEditReview(review)}
                    aria-label="Edit review"
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn px-2 py-1"
                    onClick={() => handleDeleteReview(review._id)}
                    aria-label="Delete review"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Review stars and title */}
          <div className="d-flex align-items-center gap-2">
            <div className="review-stars">{renderReviewStars(review.rating)}</div>
            <strong className="review-title">{review.reviewTitle}</strong>
          </div>

          {/* Review comment */}
          <p>{review.comment}</p>

          {/* Review media (images and videos) */}
          <div className="d-flex align-items-center gap-3">
            {review.reviewImages?.length > 0 && (
              <div className="review-images d-flex gap-3">
                {review.reviewImages.map((image, index) => (
                  <img
                    key={index}
                    src={`${API_URL}/${image}`}
                    onError={(e) => (e.target.src = '/placeholder-image.png')} // Error handler for images
                    className="rounded"
                    alt="Review"
                    width="235px"
                    height="160px"
                  />
                ))}
              </div>
            )}
            {review.reviewVideos?.length > 0 && (
              <div className="review-videos">
                {review.reviewVideos.map((video, index) => (
                  <video
                    key={index}
                    controls
                    src={`${API_URL}/${video}`}
                    className="w-100 h-100 object-cover rounded"
                    onError={(e) => {
                      console.error('Error loading video:', e.target.src);
                    }} // Log errors for debugging
                  />
                ))}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
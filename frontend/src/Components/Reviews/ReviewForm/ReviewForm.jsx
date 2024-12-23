import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_URL } from '../../../services/api';

const ReviewForm = ({ productId, onSubmitSuccess, setUserProfile, closeForm, reviewToEdit }) => {
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [comment, setComment] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reviewToEdit) {
      setRating(reviewToEdit.rating || 0);
      setReviewTitle(reviewToEdit.reviewTitle || '');
      setComment(reviewToEdit.comment || '');
      setExistingImages(reviewToEdit.reviewImages || []);
      setExistingVideos(reviewToEdit.reviewVideos || []);
    }
  }, [reviewToEdit]);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === 'images') {
      setNewImages((prev) => [...prev, ...files]);
    } else if (type === 'videos') {
      setNewVideos((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveExistingMedia = (type, index) => {
    if (type === 'image') {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setExistingVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRemoveNewMedia = (type, index) => {
    if (type === 'image') {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'video') {
      setNewVideos((prev) => prev.filter((_, i) => i !== index));
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

  const submitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }

    const MAX_FILE_SIZE_MB = 5;
    const validateFileSizes = (files) =>
      files.every((file) => file.size / (1024 * 1024) <= MAX_FILE_SIZE_MB);

    if (!validateFileSizes(newImages) || !validateFileSizes(newVideos)) {
      toast.error(`Each file must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    // Ensure reviewId is a single valid string (not an array)
    const reviewId = reviewToEdit && reviewToEdit._id && Array.isArray(reviewToEdit._id)
      ? reviewToEdit._id[0] // Extract the first element if it's an array
      : reviewToEdit?._id;  // Otherwise use the single string

    const reviewData = {
      productId,
      rating,
      reviewTitle,
      comment,
      existingImages,
      existingVideos,
      reviewId,  // Add reviewId to the review data
    };

    try {
      setIsSubmitting(true);

      if (reviewToEdit) {
        // Edit review
        await onSubmitSuccess(
          reviewData,  // Send the complete reviewData with reviewId
          { images: newImages, videos: newVideos },
          setUserProfile,
          'edit'
        );
        toast.success('Review updated successfully!');
      } else {
        // Add new review
        await onSubmitSuccess(
          reviewData,
          { images: newImages, videos: newVideos },
          setUserProfile,
          'add'
        );
        toast.success('Review submitted successfully!');
      }

      // Reset the form after successful submission
      setRating(0);
      setReviewTitle('');
      setComment('');
      setExistingImages([]);
      setExistingVideos([]);
      setNewImages([]);
      setNewVideos([]);
      setHoveredStar(null);
      closeForm();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={submitReview} className="review-form">
      <label htmlFor="reviewTitle">Review Title</label>
      <input
        id="reviewTitle"
        type="text"
        placeholder="Review Title"
        value={reviewTitle}
        onChange={(e) => setReviewTitle(e.target.value)}
        required
      />
      <label htmlFor="comment">Your Review</label>
      <textarea
        id="comment"
        placeholder="Write your review here"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>
      <span>Rating</span>
      <div className="rating-stars">{renderStars(rating)}</div>

      {/* Existing Media */}
      <div className="media-preview">
        {existingImages.map((img, idx) => (
          <div key={idx} className="preview-item">
            <img src={`${API_URL}/${img}`} alt="Existing" width="100px" />
            {/* <button onClick={() => handleRemoveExistingMedia('image', idx)}>Remove</button> */}
          </div>
        ))}
        {existingVideos.map((vid, idx) => (
          <div key={idx} className="preview-item">
            <video src={`${API_URL}/${vid}`} controls width="100px"></video>
            {/* <button onClick={() => handleRemoveExistingMedia('video', idx)}>Remove</button> */}
          </div>
        ))}
      </div>

      {/* New Media Upload */}
      <label htmlFor="reviewImages">Upload Images</label>
      <input
        id="reviewImages"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileChange(e, 'images')}
      />
      <label htmlFor="reviewVideos">Upload Videos</label>
      <input
        id="reviewVideos"
        type="file"
        accept="video/*"
        multiple
        onChange={(e) => handleFileChange(e, 'videos')}
      />
      <small>(Max 5 MB per file)</small>

      <button type="submit" disabled={isSubmitting}>
        {reviewToEdit ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
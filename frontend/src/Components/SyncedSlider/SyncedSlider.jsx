import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SyncedSlider.css'; // Add this for the custom styles

const SyncedSlider = ({ images }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const mainSliderSettings = {
    asNavFor: nav2,
    ref: (slider) => setNav1(slider),
    slidesToShow: 1,
    arrows: true,
    fade: true,
    dots: false,
  };

  const thumbnailSliderSettings = {
    asNavFor: nav1,
    ref: (slider) => setNav2(slider),
    slidesToShow: 4,
    focusOnSelect: true,
    swipeToSlide: true,
    arrows: false,
    centerMode: true,
  };

  // Handlers for grab and grabbing states
  const handleMouseDown = () => setIsGrabbing(true);
  const handleMouseUp = () => setIsGrabbing(false);
  const handleMouseLeave = () => setIsGrabbing(false);

  return (
    <div>
      {/* Main Slider */}
      <div
        className={`main-slider-image-container ${isGrabbing ? 'grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <Slider {...mainSliderSettings} className='mb-3'>
          {images.map((img, idx) => (
            <div key={idx} className='productdisplay-main-img'>
              <img src={img} alt={`Slide ${idx}`} className='w-100 h-100 object-cover object-position-top' />
            </div>
          ))}
        </Slider>
      </div>

      {/* Thumbnail Slider */}
      <Slider {...thumbnailSliderSettings} className="thumbnail-slider">
        {images.map((img, idx) => (
          <div key={idx} className='productdisplay-img-list'>
            <img src={img} alt={`Thumbnail ${idx}`} className='cursor-pointer' />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SyncedSlider;

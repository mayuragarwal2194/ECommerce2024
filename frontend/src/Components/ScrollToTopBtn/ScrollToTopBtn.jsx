import React, { useState, useEffect } from 'react'
import './ScrollToTopBtn.css'

const ScrollToTopBtn = () => {

  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down 100px
  const toggleVisibility = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Add event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    isVisible && (
      <button
        className="scroll-to-top-btn"
        onClick={scrollToTop}
        aria-label="Scroll to Top"
        title='Scroll to Top'
      >
        <i className="ri-arrow-up-s-line"></i>
      </button>
    )
  )
}

export default ScrollToTopBtn
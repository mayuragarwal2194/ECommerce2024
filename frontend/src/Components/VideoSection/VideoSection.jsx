import React, { useState } from 'react';
import './VideoSection.css';

const VideoSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handlePlayPauseButtonClick = () => {
    const videoElement = document.getElementById('video-banner');
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying); // Toggle play/pause state
    }
  };

  return (
    <>
      <section className="video-banner-section w-100">
        <div className="section-body">
          <div className="banner-video position-relative">
            {isLoading && (
              <div className="loading-spinner position-absolute top-50 start-50 translate-middle">
                <p>Loading...</p>
              </div>
            )}
            <video
              id="video-banner"
              width="100%"
              height="100%"
              className="object-cover"
              // controls
              muted
              loop
              preload="metadata"
              poster="/videos/my-video-poster.jpg" // Ensure you have a poster image in the same folder
              onLoadedData={handleLoadedData}
            >
              <source
                src="/videos/myVideo.mp4#t=0.5"
                type="video/mp4"
              />
            </video>
            <div
              className="custom-play-btn position-absolute top-50 start-50 translate-middle"
              onClick={handlePlayPauseButtonClick}
              style={{ cursor: 'pointer' }}
            >
              {isPlaying ? (
                <img src="/icons/pause.svg" alt="Pause" width="50" height="50" />
              ) : (
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 70 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M70 35C70 54.3302 54.3302 70 35 70C15.6698 70 0 54.3302 0 35C0 15.6698 15.6698 0 35 0C54.3302 0 70 15.6698 70 35ZM43.75 35L30.625 25.375V44.625L43.75 35Z"
                    fill="white"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VideoSection;
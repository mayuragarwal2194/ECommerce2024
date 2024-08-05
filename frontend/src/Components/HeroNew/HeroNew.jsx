import React from 'react'
import './HeroNew.css'

const HeroNew = () => {
  return (
    <>
      <section className="hero-section position-relative">
        <slider-container id="hero-sliderContainer">
          <div className="slider-container">
            <div className="slider-track">
              <div className="slide w-100">
                <div className="slide-overlay">
                  <div className="slide-content text-white h-100 d-flex align-items-end justify-content-center">
                    <div className="text-center">
                      <h6 className="mb-3">New Arrivals</h6>
                      <h2 className="fw-normal text-uppercase mb-3 letter-5">Beauties</h2>
                      <div className="slide-buttons d-flex align-items-center gap-4 letter-216">
                        <a href="#" className="slide-button text-decoration-none text-uppercase d-inline-block" role="button">
                          Women
                        </a>
                        <a href="#" className="slide-button text-decoration-none text-uppercase d-inline-block" role="button">
                          Men
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </slider-container>
        <a href="#value-sliderContainer" className="scroll-next-button text-decoration-none text-white bg-white rounded-circle d-flex align-items-center justify-content-center position-absolute" role="button">
          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.893555 3.9425L7.9998 11.0475L15.1061 3.9425" stroke="#070D10" strokeWidth="0.888281" strokeLinecap="square" />
          </svg>
        </a>
      </section>
    </>
  )
}

export default HeroNew
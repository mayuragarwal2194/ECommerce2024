import React from 'react'
import './AboutSection.css'

const AboutSection = () => {
  return (
    <>
      <section className="about-section w-100 section-padding theme-bg">
        <div className="container">
          <div className="row about-row align-items-center justify-content-center">
            <div className="col-12 col-lg-5">
              <div className="about-left d-flex flex-column gap-3 gap-lg-4">
                <h6 className="about-subhead text-uppercase">About Us</h6>
                <h4 className="about-head text-uppercase fw-normal letter-32 line-height-24">
                  What set’s us apart from the rest
                </h4>
                <p className="about-description">
                  Dalia was born from the encounter between Wendy and Léo et Violette. Wendy's minimalist and elegant universe corresponds perfectly to the spirit of Léo et Violette.
                </p>
                <a
                  href="#"
                  role="button"
                  className="ff-btn ff-btn-fill-dark text-capitalize text-decoration-none d-inline-block mt-20 w-fit-content"
                >
                  Discover
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="about-images d-flex">
                <div
                  className="about-image-small flex-shrink-0"
                  style={{ backgroundImage: 'url(images/about-small.webp)' }}
                >
                  {/* <img
                  src="./images/about-small.webp"
                  className="img-fluid"
                  alt=""
                /> */}
                </div>
                <div className="about-image-big flex-shrink-0">
                  <img src="images/about-big.webp" className="img-fluid" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutSection
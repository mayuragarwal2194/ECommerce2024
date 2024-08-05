import React from 'react'
import Slider from "react-slick";
import './PopularNew.css'

const PopularNew = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <>
      <section className="popular-section section-padding text-center theme-bg">
        <div className="container">
          <div className="section-header">
            <h6 className="section-subhead">Shop</h6>
            <h3 className="section-head">Most popular</h3>
          </div>
          <div className="section-body">
            <div id="popular-main-sliderContainer" className="responsive">
              <div className="slider-container">
                <Slider {...settings}>
                <div className="slide w-100">
                  <div className="row justify-content-center align-items-lg-center">
                    <div className="col-12 col-md-6 col-lg-5">
                      <div className="popular-funtional-image position-relative">
                        <img
                          src="images/popula-bigr.png"
                          className="img-fluid"
                          alt="Product Image"
                        />
                        <a
                          href="#"
                          className="goto-item-btn rounded-circle position-absolute p-3"
                          role="button"
                          aria-label="Go to This Popular Item"
                        >
                          <div className="goto-inner-circle bg-white rounded-circle"></div>
                        </a>
                        <a
                          href="#"
                          className="addto-item-btn position-absolute text-decoration-none"
                          role="button"
                          aria-label="Add The Popular Item to this button"
                        >
                          <div className="addto-item-inner bg-white rounded-circle d-flex align-items-center justify-content-center">
                            <svg
                              width="6"
                              height="6"
                              viewBox="0 0 6 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.1875 5.45303V0.296783H3.0625V5.45303H2.1875ZM0.0468751 3.31241V2.43741H5.20313V3.31241H0.0468751Z"
                                fill="black"
                              />
                            </svg>
                          </div>
                        </a>
                      </div>
                      <a
                        href="#"
                        role="button"
                        className="btn-fill-black text-decoration-none text-white bg-black-1c rounded d-inline-block mt-3 d-lg-none text-uppercase"
                      >
                        View Product
                      </a>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div id="popular-inner-sliderContainer" className="responsive">
                        <div className="slider-container">
                          <div className="slider-track">
                            <div className="slide">
                              <div className="popular-card d-none d-md-inline-block text-center">
                                <div className="popular-card-image position-relative">
                                  <img
                                    src="./images/Grand-Nova.png"
                                    className="img-fluid"
                                    alt="Product Image"
                                  />
                                  <div className="best-seller-tag best-seller-tag-white text-uppercase position-absolute">
                                    Best Seller
                                  </div>
                                </div>
                                <div className="card-body text-center mt-3 letter-216">
                                  <h6 className="product-title text-uppercase w-fit-content m-auto mb-1">
                                    Le Dalia Ivory Liégé
                                  </h6>
                                  <div className="product-price w-fit-content m-auto">
                                    $ 380
                                  </div>
                                  <a
                                    href="#"
                                    role="button"
                                    className="ff-btn ff-btn-fill-dark text-decoration-none d-inline-block mt-3 text-uppercase"
                                  >
                                    View Product
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slide w-100">
                  <div className="row justify-content-center align-items-lg-center">
                    <div className="col-12 col-md-6 col-lg-5">
                      <div className="popular-funtional-image position-relative">
                        <img
                          src="images/popula-bigr.png"
                          className="img-fluid"
                          alt="Product Image"
                        />
                        <a
                          href="#"
                          className="goto-item-btn rounded-circle position-absolute p-3"
                          role="button"
                          aria-label="Go to This Popular Item"
                        >
                          <div className="goto-inner-circle bg-white rounded-circle"></div>
                        </a>
                        <a
                          href="#"
                          className="addto-item-btn position-absolute text-decoration-none"
                          role="button"
                          aria-label="Add The Popular Item to this button"
                        >
                          <div className="addto-item-inner bg-white rounded-circle d-flex align-items-center justify-content-center">
                            <svg
                              width="6"
                              height="6"
                              viewBox="0 0 6 6"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.1875 5.45303V0.296783H3.0625V5.45303H2.1875ZM0.0468751 3.31241V2.43741H5.20313V3.31241H0.0468751Z"
                                fill="black"
                              />
                            </svg>
                          </div>
                        </a>
                      </div>
                      <a
                        href="#"
                        role="button"
                        className="btn-fill-black text-decoration-none text-white bg-black-1c rounded d-inline-block mt-3 d-lg-none text-uppercase"
                      >
                        View Product
                      </a>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div id="popular-inner-sliderContainer" className="responsive">
                        <div className="slider-container">
                          <div className="slider-track">
                            <div className="slide">
                              <div className="popular-card d-none d-md-inline-block text-center">
                                <div className="popular-card-image position-relative">
                                  <img
                                    src="./images/Grand-Nova.png"
                                    className="img-fluid"
                                    alt="Product Image"
                                  />
                                  <div className="best-seller-tag best-seller-tag-white text-uppercase position-absolute">
                                    Best Seller
                                  </div>
                                </div>
                                <div className="card-body text-center mt-3 letter-216">
                                  <h6 className="product-title text-uppercase w-fit-content m-auto mb-1">
                                    Le Dalia Ivory Liégé
                                  </h6>
                                  <div className="product-price w-fit-content m-auto">
                                    $ 380
                                  </div>
                                  <a
                                    href="#"
                                    role="button"
                                    className="ff-btn ff-btn-fill-dark text-decoration-none d-inline-block mt-3 text-uppercase"
                                  >
                                    View Product
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PopularNew
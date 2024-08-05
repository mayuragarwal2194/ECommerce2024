import React from 'react'
import './OurSelectionSection.css'

const OurSelectionSection = () => {
  return (
    <>
      <section className="selection-section w-100 section-padding text-center theme-bg">
        <div className="container h-100">
          <div className="section-header">
            <h6 className="section-subhead">Our selection</h6>
            <h3 className="section-head">Product of the week</h3>
          </div>
          <div className="section-body">
            <div className="row selection-row">
              <div className="col-12 col-md-6">
                <slider-container id="selection-sliderContainer">
                  <div className="slider-container">
                    <div className="slider-track">
                      <div className="slide">
                        <div className="selection-product-card">
                          <div className="card-image m-auto">
                            <img
                              src="images/shirt.png"
                              className="w-100 h-100 object-cover"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </slider-container>
              </div>
              <div className="col-12 col-md-6">
                <div className="selection-product-detail text-start d-flex flex-column gap-4">
                  <div className="product-detail-header d-flex flex-column">
                    <div className="best-seller-tag best-seller-tag-white text-uppercase w-fit-content">
                      New
                    </div>
                    <h4 className="product-title fw-normal text-uppercase letter-32 mb-0">
                      Le Continental Camel Liégé
                    </h4>
                    <div className="product-price letter-32">$200.00</div>
                  </div>
                  <p className="product-description mb-0">
                    Continental wallet in calfskin. Inside zip pocket for coins. 2
                    flat pockets for checks or bills. Leather lining. Heat embossed
                    logo.
                  </p>
                  <div className="product-variant">
                    <span className="variant-title">Color:</span>
                    <span className="variant-name">Camel Liégé</span>
                    <div className="variant-color-box w-fit-content mt-2">
                      <div className="color-blue"></div>
                    </div>
                  </div>
                  <div className="product-quantity">
                    <div className="product-outer mt-2 d-flex align-items-center">
                      <button className="decrement border-0 bg-transparent d-flex align-items-center justify-content-center">
                        -
                      </button>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        max="10"
                        className="border-0 text-center bg-transparent"
                      />
                      <button className="increment border-0 bg-transparent d-flex align-items-center justify-content-center">
                        +
                      </button>
                    </div>
                  </div>
                  <div
                    role="button"
                    className="ff-btn ff-btn-fill-dark text-uppercase text-decoration-none d-inline-block w-75 text-center"
                  >
                    Add to cart
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OurSelectionSection
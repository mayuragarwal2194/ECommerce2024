import React from 'react'
import './NewArrivalSection.css'

const NewArrivalSection = () => {
  return (
    <>
      <section className="new-arrival-section w-100" id="arrival">
        <div className="arrival-bg section-padding text-white">
          <div className="container h-100">
            <div className="w-55 h-100 d-flex flex-column justify-content-between arrival-inner-wrapper">
              <h6 className="text-uppercase">New Arrivals</h6>
              <div className="d-flex flex-column gap-4">
                <h1 className="fw-normal line-height-40">
                  Embrace the Season's Hottest Trends with Our Just-Arrived Pieces
                </h1>
                <p className="line-height-24">
                  Handpicked for style and comfort, these are the must-haves every closet needs.
                </p>
                <div className="arrival-buttons">
                  <a
                    href="#"
                    role="button"
                    className="ff-btn ff-btn-fill-dark text-capitalize text-decoration-none d-inline-block"
                  >
                    Shop Now
                  </a>
                  <a
                    href="#"
                    role="button"
                    className="text-decoration-none text-white ms-4"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewArrivalSection
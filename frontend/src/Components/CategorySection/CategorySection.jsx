import React from 'react'
import './CategorySection.css'

const CategorySection = () => {
  return (
    <section className="category-section section-padding text-center theme-bg">
      <div className="container">
        <div className="section-header">
          <h6 className="section-subhead">Browse by</h6>
          <h3 className="section-head">category</h3>
        </div>
        <div className="section-body">
          <div className="row category-row">
            <div className="col-12 col-md-6">
              <a href="#" className="category-card position-relative d-block">
                <div className="category-image category-image-left position-relative">
                  <img
                    src="images/col1.webp" // Adjust the path to your image
                    alt="Category Image"
                    className="w-100 h-100 object-cover"
                  />
                  <div className="image-overlay position-absolute w-100 h-100"></div>
                </div>
                <div className="category-name fw-bold text-uppercase position-absolute letter-216">
                  matching set
                </div>
              </a>
            </div>
            <div className="col-12 col-md-6">
              <div className="category-right d-flex flex-column justify-content-between h-100">
                <a href="#" className="category-card position-relative d-block">
                  <div className="category-image position-relative">
                    <img
                      src="images/top.webp" // Adjust the path to your image
                      alt="Category Image"
                      className="w-100 h-100 object-cover"
                    />
                    <div className="image-overlay position-absolute w-100 h-100"></div>
                  </div>
                  <div className="category-name fw-bold text-uppercase position-absolute letter-216">
                    tops
                  </div>
                </a>
                <a href="#" className="category-card position-relative d-block">
                  <div className="category-image position-relative">
                    <img
                      src="images/top2.webp" // Adjust the path to your image
                      alt="Category Image"
                      className="w-100 h-100 object-cover"
                    />
                    <div className="image-overlay position-absolute w-100 h-100"></div>
                  </div>
                  <div className="category-name fw-bold text-uppercase position-absolute letter-216">
                    bottoms
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection
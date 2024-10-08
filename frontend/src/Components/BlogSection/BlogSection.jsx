import React from 'react'
import './BlogSection.css'
import Slider from 'react-slick'
import { Link } from 'react-router-dom';

const BlogSection = () => {
  var settings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 200,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          speed: 200
        },
      },
    ]
  };
  return (
    <>
      <section className="blog-section w-100 section-padding theme-bg">
        <div className="container">
          <div className="section-header text-center">
            <h6 className="section-subhead">News</h6>
            <h3 className="section-head">From The Blog</h3>
          </div>
          <div className="section-body">
            <div className="slider-container" id="blog-sliderContainer">
              <Slider {...settings}>
                <div className="slide">
                  <div className="card h-100 border-0 bg-transparent custom-blog-card">
                    <div className="blog-image">
                      <Link to={'/'} className="text-decoration-none">
                        <img
                          src="images/blog1.webp"
                          className="article-image w-100 h-100"
                          alt="Blog_Image"
                        />
                      </Link>
                    </div>
                    <div className="card-body px-0 pb-0 mt-3">
                      <h6 className="blog-category mb-3">Product</h6>
                      <Link to={'/'} className="text-decoration-none">
                        <h5 className="blog-title fw-normal mb-3 text-uppercase">
                          How to choose your business bag
                        </h5>
                      </Link>
                    </div>
                    <Link
                      to={'/'}
                      role="button"
                      className="ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
                <div className="slide">
                  <div className="card h-100 border-0 bg-transparent custom-blog-card">
                    <div className="blog-image">
                      <Link to={'/'} className="text-decoration-none">
                        <img
                          src="images/blog2.webp"
                          className="article-image w-100 h-100"
                          alt="Blog_Image"
                        />
                      </Link>
                    </div>
                    <div className="card-body px-0 pb-0 mt-3">
                      <h6 className="blog-category mb-3">Story</h6>
                      <Link to={'/'} className="text-decoration-none">
                        <h5 className="blog-title fw-normal mb-3 text-uppercase">
                          A shooting day in Etretat
                        </h5>
                      </Link>
                    </div>
                    <Link
                      to={'/'}
                      role="button"
                      className="ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
                <div className="slide">
                  <div className="card h-100 border-0 bg-transparent custom-blog-card">
                    <div className="blog-image">
                      <Link to={'/'} className="text-decoration-none">
                        <img
                          src="images/blog3.jpg"
                          className="article-image w-100 h-100"
                          alt="Blog_Image"
                        />
                      </Link>
                    </div>
                    <div className="card-body px-0 pb-0 mt-3">
                      <h6 className="blog-category mb-3">Product</h6>
                      <Link to={'/'} className="text-decoration-none">
                        <h5 className="blog-title fw-normal mb-3 text-uppercase">
                          Focus on your new favorite: Le Gianni
                        </h5>
                      </Link>
                    </div>
                    <Link
                      to={'/'}
                      role="button"
                      className="ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </Slider>
            </div>
            <Link
              to={'/'}
              role="button"
              id="discover-btn"
              className="ff-btn ff-btn-fill-dark discover-btn text-uppercase text-decoration-none d-block w-fit-content m-auto xs-small-fonts"
            >
              Discover all our stories
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlogSection
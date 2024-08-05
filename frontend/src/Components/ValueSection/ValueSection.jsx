import React from 'react';
import Slider from "react-slick";
import './ValueSection.css'; // Assume you have a corresponding CSS file for styling

const ValueSection = () => {
  var settings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2
  };

  return (
    <section className="value-section bg-black">
      <div className="container">
        <div id="value-sliderContainer">
          <Slider {...settings}>
            <div className="slide">
              <div className="value-card text-center text-white letter-5">
                <div className="value-head fw-bold">68%</div>
                <p className="value-description fw-normal m-auto text-uppercase line-height-40">
                  Of our fabrics this season are made with recycled materials.
                </p>
              </div>
            </div>
            <div className="slide">
              <div className="value-card text-center text-white letter-5">
                <div className="value-head fw-bold">100%</div>
                <p className="value-description fw-normal m-auto text-uppercase line-height-40">
                  Of our Oeko-Tex® certified technical fabrics are made without using harmful chemicals.
                </p>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;

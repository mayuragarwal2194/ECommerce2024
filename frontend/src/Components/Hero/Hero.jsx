import React from 'react'
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero w-100'>
      <div className="container">
        <div className="d-flex">
          <div className="hero-left d-flex flex-column justify-content-center gap-3">
            <h2 className='text-uppercase fw-600'>New Arrivals only</h2>
            <div>
              <div className="hero-hand-icon d-flex align-items-center gap-3">
                <p className='mb-0 fw-600'>New</p>
                <img src={hand_icon} alt="" />
              </div>
              <p className='mb-0 fw-600'>Collection</p>
              <p className='mb-0 fw-600'>For Everyone</p>
            </div>
            <div className="hero-latest-btn d-flex align-items-center justify-content-center gap-3 text-white py-3 px-4 rounded-pill">
              <div>Latest Collection</div>
              <img src={arrow_icon} alt="" width={'20px'} />
            </div>
          </div>
          <div className="hero-right d-flex align-items-center justify-content-center">
            <img src={hero_image} alt="" width={'80%'}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
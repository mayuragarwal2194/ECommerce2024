import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import insta_icon from '../Assets/instagram_icon.png'
import pinterest_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className="container">
      <div className='footer d-flex flex-column justify-content-center align-items-center gap-4 w-100'>
        <div className="footer-logo d-flex align-items-center gap-3">
          <img src={footer_logo} alt="" />
          <p className='text-uppercase mb-0 fw-600'>Shopper</p>
        </div>
        <ul className='footer-links list-unstyled d-flex align-items-cener justify-content-center gap-5 mb-0'>
          <li className='cursor-pointer'>Company</li>
          <li className='cursor-pointer'>Products</li>
          <li className='cursor-pointer'>Offices</li>
          <li className='cursor-pointer'>About</li>
          <li className='cursor-pointer'>Contact</li>
        </ul>
        <div className="footer-social-icons d-flex align-items-center justify-content-center gap-4">
          <div className="footer-icons-wrapper">
            <img src={insta_icon} alt="" />
          </div>
          <div className="footer-icons-wrapper">
            <img src={pinterest_icon} alt="" />
          </div>
          <div className="footer-icons-wrapper">
            <img src={whatsapp_icon} alt="" />
          </div>
        </div>
        <div className="footer-copyright w-100 text-center">
          <hr className='w-100 rounded-pill' />
          <p>Copyright @ 2024 - All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
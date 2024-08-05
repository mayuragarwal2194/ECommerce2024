import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = ({ description }) => {
  return (
    <div className='descriptionbox my-5 py-5'>
      <ul className="descriptionbox-navigator d-flex align-items-center justify-content-center gap-3 list-unstyled mb-5">
        <li className='descriptionbox-navs px-3 active' id='nav-description'>Description</li>
        <li className='descriptionbox-navs px-3' id='nav-shiping'>Shiping Info</li>
        <li className='descriptionbox-navs px-3' id='nav-reviews'>Reviews (122)</li>
      </ul>
      <div className="descriptionbox-description w-75 m-auto">
        <p>{description}</p>
      </div>
    </div>
  )
}

export default DescriptionBox;
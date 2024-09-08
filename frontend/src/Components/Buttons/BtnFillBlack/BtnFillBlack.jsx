import React from 'react'
import './BtnFillBlack.css'

const BtnFillBlack = ({ btn_name, onClick }) => {
  return (
    <div className="BtnFillBlack">
      <button className='ff-btn ff-btn-fill-dark text-capitalize text-decoration-none d-inline-block w-fit-content' onClick={onClick}>
        {btn_name}
      </button>
    </div>
  )
}

export default BtnFillBlack
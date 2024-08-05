import React from 'react'
import './BtnOutlineRed.css'

const BtnOutlineRed = ({btn_name}) => {
  return (
    <>
      <button className='btn_outline_red px-4 py-2 rounded-pill cursor-pointer fw-500 bg-transparent'>{btn_name}</button>
    </>
  )
}

export default BtnOutlineRed
// BtnFillRed.jsx
import React from 'react';
import './Btn_Fill_Red.css';

const BTN_FILL_RED = ({ btn_name, onClick }) => {
  return (
    <button className='btn_fill_red text-white px-4 py-2 rounded-pill cursor-pointer fw-500' onClick={onClick}>
      {btn_name}
    </button>
  );
};

export default BTN_FILL_RED;

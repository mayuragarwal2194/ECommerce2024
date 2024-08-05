import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'

const Item = ({ image, itemName, newPrice, oldPrice, id }) => {
  return (
    <div className="col item">
      <Link to={`/product/${id}`} className='text-decoration-none'>
        <div className="card border-0">
          <div className='item-image'>
          <img src={`http://localhost:5000/uploads/featured/${image}`} alt={itemName} className='w-100' />
          </div>
          <div className="card-body px-0">
            <h5 className="item-name fw-500">{itemName}</h5>
            <div className="item-prices d-flex align-items-center gap-3">
              <div className="item-price-new fw-600">
                ${newPrice}
              </div>
              <div className="item-price-old text-decoration-line-through fw-500">
                ${oldPrice}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Item
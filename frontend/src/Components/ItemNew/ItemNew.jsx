import React from 'react';
import { Link } from 'react-router-dom';
import './ItemNew.css';

const extractTag = (tag) => {
  const parts = tag.split(' ');
  return parts.slice(0, -1).join(' ');
};

const ItemNew = ({ image, itemName, newPrice, oldPrice, id, tag }) => {
  const formattedTag = extractTag(tag);

  return (
    <div className="itemnew">
      <Link to={`/product/${id}`} className='mega-card text-decoration-none'>
        <div className="item-image w-100 position-relative">
          <img src={`http://localhost:5000/uploads/featured/${image}`} alt={itemName} className="w-100 h-auto" />
          <div className={`best-seller-tag text-uppercase position-absolute`}>{formattedTag}</div>
        </div>
        <div className="card-body text-center mt-3 letter-216">
          <h6 className="product-title">{itemName}</h6>
          <div className="product-price">
            <div className="item-price-new fw-600">
              ${newPrice}
            </div>
            <div className="item-price-old text-decoration-line-through fw-500">
              ${oldPrice}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemNew;
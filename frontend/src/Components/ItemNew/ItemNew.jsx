import React from 'react';
import { Link } from 'react-router-dom';
import './ItemNew.css';
import { API_URL } from '../../services/api';

const extractTag = (tag) => {
  if (!tag) return ''; // Return an empty string or handle it as needed

  const parts = tag.split(' ');
  return parts.slice(0, -1).join(' ');
};


const ItemNew = ({ image, itemName, newPrice, oldPrice, id, tag, isVariant = false }) => {
  const formattedTag = extractTag(tag);

  const imagePath = isVariant
    ? `${API_URL}/uploads/variants/featured/${image}`
    : `${API_URL}/uploads/featured/${image}`;

  return (
    <div className="itemnew">
      <Link to={`/product/${id}`} className='mega-card text-decoration-none'>
        <div className="item-image w-100 position-relative overflow-hidden">
          <img src={imagePath} alt={itemName} className="w-100" />
          <div className={`best-seller-tag text-uppercase position-absolute`}>{formattedTag}</div>
        </div>
        <div className="card-body text-center mt-3 letter-216 py-0 px-1 px-lg-3">
          <h6 className="product-title xs-small-fonts large-fonts">{itemName}</h6>
          <div className="product-price">
            <div className="item-price-new fw-600 xs-large-fonts fw-bold">
              ${newPrice}
            </div>
            <div className="item-price-old text-decoration-line-through xs-large-fonts fw-500">
              ${oldPrice}
            </div>
          </div>
        </div>
      </Link>
      {isVariant &&
        <div className="w-100 text-center mt-3">
          <div className='ff-btn ff-btn-small ff-btn-fill-dark blog-btn text-capitalize text-decoration-none d-inline-block w-fit-content'>
            Move to Bag
          </div>
        </div>
      }
    </div>
  );
};

export default ItemNew;
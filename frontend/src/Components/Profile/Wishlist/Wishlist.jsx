import React from 'react';
import ItemNew from '../../ItemNew/ItemNew';
import './Wishlist.css';
import { useWishlist } from '../../../Context/WishlistContext';

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();

  // Loading and error handling
  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p>{error}</p>;
  if (!wishlist.length) return <p>Your wishlist is empty.</p>;

  return (
    <div>
      <h2 className='fw-bold mb-3'>My Wishlist</h2>
      <div className="row row-cols-2 row-cols-md-3 g-lg-4">
        {wishlist.map((item, index) => (
          <div key={index} className='position-relative'>
            <ItemNew
              id={item.productId}
              image={item.featuredImage}
              itemName={item.itemName}
              newPrice={item.newPrice}
              oldPrice={item.oldPrice}
              tag={item.tag}
              isVariant={true}
            />
            <div
              className='w-fit-content wishlist-cancel-btn position-absolute'
              role='button'
              onClick={() => {
                if (item.variantId) {
                  removeFromWishlist(item.productId, item.variantId);
                } else {
                  console.warn(`Variant ID missing for product ${item.productId}`);
                }
              }}
              title='Remove From Wishlist'
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 44 45" fill="none">
                <circle cx="22" cy="22.126" r="22" fill="black" fillOpacity="0.11"></circle>
                <path d="M28.5994 28.7254L15.3994 15.5254M28.5995 15.5254L15.3994 28.7254" stroke="white" strokeOpacity="0.85" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

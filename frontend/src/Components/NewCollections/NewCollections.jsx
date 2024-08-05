import React from 'react';
import './NewCollections.css';
// import new_collection from '../Assets/new_collections';
import new_collection from '../../Data/new_collections';
import Item from '../Item/Item'

const NewCollections = () => {
  return (
    <div className="container my-5">
      <div className='new-collections'>
        <div className="section-head text-center mb-5">
          <h1 className='text-capitalize fw-700'>New Collections</h1>
          <div className="section-head-underline m-auto"></div>
        </div>
        <div className="collections">
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {new_collection.map((item, i) => {
              return <Item key={i} image={item.image} itemName={item.itemName} new_price={item.new_price} oldPrice={item.oldPrice} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewCollections
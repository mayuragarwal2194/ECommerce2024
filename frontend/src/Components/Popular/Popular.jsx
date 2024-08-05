import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const products = await response.json();
        const popularItems = products.filter(product => product.isPopular);
        setPopularProducts(popularItems);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="container">
      <div className='popular py-5'>
        <div className="section-head text-center mb-5">
          <h1 className='text-capitalize fw-700'>Popular In women</h1>
          <div className="section-head-underline m-auto"></div>
        </div>
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {popularProducts.map((item, i) => (
            <Item key={i} id={item.id} image={item.featuredImage} itemName={item.itemName} new_price={item.newPrice} oldPrice={item.oldPrice} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Popular;
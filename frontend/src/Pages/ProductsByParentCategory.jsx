import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductsByParentCategory } from '../services/api';
import ItemNew from '../Components/ItemNew/ItemNew';

const ProductsByParentCategory = () => {
  const { parentId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await fetchProductsByParentCategory(parentId);
        setProducts(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [parentId]);

  return (
    <div className='shop-category'>
      <div className="container">
        <div className="shopcategory-indexsort my-4 d-flex align-items-center justify-content-between">
          <p className='mb-0'>
            <span className='fw-600'>Showing 1-{products.length}</span> Out of {products.length} products
          </p>
          <div className="shopcategory-sort rounded-pill px-4 py-2">
            Sort By <i className="ri-arrow-down-s-line"></i>
          </div>
        </div>
        <div className="shopcategory-products">
          <div className="row row-cols-2 row-cols-md-5 g-4">
            {products.length > 0 ? (
              products.map((item) => (
                <ItemNew
                  key={item._id}
                  id={item._id}
                  image={item.featuredImage}
                  itemName={item.itemName}
                  newPrice={item.newPrice}
                  oldPrice={item.oldPrice}
                  tag={item.tag}
                />
              ))
            ) : (
              <p>No products found for this category.</p>
            )}
          </div>
        </div>
        <div className='shopcategory-loadmore text-center my-5 pb-5'>
          <button className='rounded-pill fw-500 px-5 py-3'>Explore More</button>
        </div>
      </div>
    </div>

  );
}

export default ProductsByParentCategory;

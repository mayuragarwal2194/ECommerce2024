import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductsByChildCategory } from '../services/api';
import ItemNew from '../Components/ItemNew/ItemNew';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';

const ProductsByChildCategory = () => {
  const { childId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading to true before fetching products
      setProducts([]); // Reset products state to avoid stale data
      try {
        const result = await fetchProductsByChildCategory(childId);
        setProducts(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching products
      }
    };

    fetchProducts();
  }, [childId]);

  return (
    <div className='shop-category'>
      <div className="container">
        <div className="shopcategory-indexsort my-4 d-flex align-items-center justify-content-between">
          <p className='mb-0'>
            <span className='fw-600'>Showing 1-{products.length}</span> Out of {products.length} products
          </p>
          <div className="shopcategory-sort rounded-pill px-4 py-2">
            Sort By <img src={dropdown_icon} alt="Sort Icon" />
          </div>
        </div>
        <div className="shopcategory-products">
          <div className="row row-cols-1 row-cols-md-5 g-4">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length > 0 ? (
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
  )
}

export default ProductsByChildCategory;

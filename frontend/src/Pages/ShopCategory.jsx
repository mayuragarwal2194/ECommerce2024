import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CSS/ShopCategory.css';
import { getProductsByTopCategory, fetchTopCategories } from '../services/api';
import ItemNew from '../Components/ItemNew/ItemNew';

const ShopCategory = () => {
  const { categoryId } = useParams(); // This is the category name from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch category data
    const fetchCategoryData = async () => {
      // Clear state before fetching new data
      setProducts([]);
      setLoading(true);
      setError(null);

      try {
        // Fetch all categories
        const categoryData = await fetchTopCategories();

        // Find the category ID based on the category name from the URL
        const category = categoryData.find(cat => cat.name.toLowerCase() === categoryId.toLowerCase());

        if (category) {
          // Fetch products by category ID
          const products = await getProductsByTopCategory(category._id);
          setProducts(products);
          if (products.length === 0) {
            // Optionally handle the case where no products are found
            console.info('No products found for this category.');
          }
        } else {
          setError('Category not found');
          console.error('Category not found');
        }
      } catch (error) {
        setError('Error fetching category data');
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Invoke the function to fetch data
    fetchCategoryData();

    // Cleanup function to reset states on category change
    return () => {
      setProducts([]);
      setLoading(false);
      setError(null);
    };
  }, [categoryId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='shop-category mt-5'>
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
};

export default ShopCategory;
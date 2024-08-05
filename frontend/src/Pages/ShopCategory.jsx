import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CSS/ShopCategory.css';
import { getProductsByTopCategory, fetchTopCategories } from '../services/api';
import Item from '../Components/Item/Item';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';

const ShopCategory = () => {
  const { categoryId } = useParams(); // This is the category name from URL
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch category data
    const fetchCategoryData = async () => {
      // Clear state before fetching new data
      setProducts([]);
      setBanner('');
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
          setBanner(category.banner); // Adjust if you have a banner property
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
      setBanner('');
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
    <div className='shop-category'>
      <div className="container">
        {banner && <img src={banner} className="w-100 h-auto my-4 d-block" alt="Category Banner" />}
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
            {products.length > 0 ? (
              products.map((item) => (
                <Item
                  key={item._id}
                  id={item._id}
                  image={item.featuredImage}
                  itemName={item.itemName}
                  newPrice={item.newPrice}
                  oldPrice={item.oldPrice}
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
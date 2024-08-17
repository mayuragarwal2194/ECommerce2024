// ProductsByTopCategory.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByTopCategory } from '../services/api';

const ProductsByTopCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProductsByTopCategory(categoryId);
        setProducts(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, [categoryId]);

  return (
    <div>
      <h1>Products for Top Category</h1>
      <ul>
        {products.map(product => (
          <li key={product._id}>efwefewf</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsByTopCategory;

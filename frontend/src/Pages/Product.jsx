import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';

const Product = () => {
  const { allProducts } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log('All Products:', allProducts);
    console.log('Product ID:', productId);

    // Wait until allProducts is populated before attempting to find the product
    if (allProducts.length > 0) {
      const foundProduct = allProducts.find((e) => e._id === productId);
      setProduct(foundProduct);
    }
  }, [allProducts, productId]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (allProducts.length === 0) {
    return <div>Loading products...</div>; // Show a loading message while products are being fetched
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail my-5">
      <div className='container'>
        <Breadcrum product={product} />
        <ProductDisplay product={product} />
        <RelatedProducts category={product.category} currentProductId={product._id} />
      </div>
    </div>
  );
};

export default Product;
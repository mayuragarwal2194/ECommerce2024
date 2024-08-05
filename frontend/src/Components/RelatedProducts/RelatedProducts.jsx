import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import './RelatedProducts.css'
import Item from '../Item/Item'

const RelatedProducts = ({ category, currentProductId }) => {
  const { allProducts } = useContext(ShopContext);

  // Filter products by category and exclude the current product, then limit to 4 products
  const relatedProducts = allProducts
    .filter(product => product.category === category && product.id !== currentProductId)
    .slice(0, 4); // Limit to 4 products

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-list">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {relatedProducts.map((item, i) => (
            <Item key={i} id={item.id} image={item.featuredImage} itemName={item.itemName} newPrice={item.newPrice} oldPrice={item.oldPrice} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RelatedProducts
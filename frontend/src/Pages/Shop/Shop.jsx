import React, { useEffect, useState } from 'react';
import ItemNew from '../../Components/ItemNew/ItemNew';
import Filter from '../../Components/Filter/Filter';
import { getAllProducts, getProductsByTopCategory } from '../../services/api';
import AppliedFilters from '../../Components/Filter/AppliedFilters/AppliedFilters';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    topCategories: [],
    parentCategories: [],
    childCategories: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 30000 },
    sortBy: '', // Added to initialize sorting
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let allProducts = [];

        if (filters.topCategories.length > 0) {
          const filteredProducts = await Promise.all(
            filters.topCategories.map((id) => getProductsByTopCategory(id))
          );
          allProducts = filteredProducts.flat();
        } else {
          allProducts = await getAllProducts();
        }

        // Consolidate all filters
        const { sizes, colors, priceRange, sortBy } = filters;
        const { min, max } = priceRange;

        allProducts = allProducts.filter((product) => {
          // Size filter
          const sizeMatch =
            sizes.length === 0 ||
            product.variants.some((variant) =>
              sizes.some((sizeId) =>
                variant.attributes.size.includes(sizeId)
              )
            );

          // Color filter
          const colorMatch =
            colors.length === 0 ||
            product.variants.some((variant) =>
              colors.includes(variant.attributes.color)
            );

          // Price filter
          const priceMatch =
            product.variants.some(
              (variant) => variant.newPrice >= min && variant.newPrice <= max
            );

          return sizeMatch && colorMatch && priceMatch;
        });

        // Apply sorting
        if (sortBy) {
          allProducts.sort((a, b) => {
            if (sortBy === 'alphabetically-asc') {
              return a.itemName.localeCompare(b.itemName);
            } else if (sortBy === 'alphabetically-desc') {
              return b.itemName.localeCompare(a.itemName);
            } else {
              const minPriceA = Math.min(
                ...a.variants.map((variant) => variant.newPrice)
              );
              const minPriceB = Math.min(
                ...b.variants.map((variant) => variant.newPrice)
              );

              return sortBy === 'price-asc'
                ? minPriceA - minPriceB
                : minPriceB - minPriceA;
            }
          });
        }

        setProducts(allProducts);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleApplyFilter = (selectedFilters) => {
    setFilters(selectedFilters);
  };

  const handleRemoveFilter = (key) => {
    setFilters((prevFilters) => {
      const [filterType, filterValue] = key.split('-');
      if (filterType === 'priceRange') {
        return { ...prevFilters, priceRange: { min: 0, max: 30000 } };
      }

      if (filterType === 'sortBy') {
        return { ...prevFilters, sortBy: '' };
      }

      return {
        ...prevFilters,
        [filterType]: prevFilters[filterType].filter((item) => item !== filterValue),
      };
    });
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="px-12 px-lg-5 section-padding">
      <div className="row">
        <div className="col-3">
          <Filter filters={filters} onApplyFilter={handleApplyFilter} />
        </div>
        <div className="col-9">
          <AppliedFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
          <div className="row row-cols-2 row-cols-md-4 g-4 mt-3">
            {products.length > 0 ? (
              products.map((item) => {
                const displayVariant =
                  item.variants.find(
                    (variant) =>
                      variant.newPrice >= filters.priceRange.min &&
                      variant.newPrice <= filters.priceRange.max
                  ) || item.variants[0];

                return (
                  <ItemNew
                    key={item._id}
                    id={item._id}
                    image={item.featuredImage}
                    itemName={item.itemName}
                    newPrice={displayVariant.newPrice}
                    oldPrice={displayVariant.oldPrice}
                    tag={item.tag}
                  />
                );
              })
            ) : (
              <p>No products found. Try adjusting your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Shop;
// LiveSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getAllProducts } from '../../services/api';
import { fetchTopCategories, fetchParentCategories, fetchChildCategories, API_URL } from '../../services/api';
import { Link } from 'react-router-dom';
import './LiveSearch.css'

const extractTag = (tag) => {
    if (!tag) return ''; // Return an empty string or handle it as needed

    const parts = tag.split(' ');
    return parts.slice(0, -1).join(' ');
};

const LiveSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const searchInputRef = useRef(null); // Reference for the search input

    useEffect(() => {
        // Fetch products and categories when the component mounts
        const fetchData = async () => {
            try {
                console.log("Fetching all data...");
                const productsData = await getAllProducts();
                const topCategoriesData = await fetchTopCategories();
                const parentCategoriesData = await fetchParentCategories();
                const childCategoriesData = await fetchChildCategories();

                setProducts(productsData);
                setTopCategories(topCategoriesData);
                setParentCategories(parentCategoriesData);
                setChildCategories(childCategoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Filter products and categories based on the search term
        if (searchTerm.trim() === "") {
            setFilteredProducts([]);
            setFilteredCategories([]);
        } else {
            console.log("Filtering data for search term:", searchTerm);

            const filteredProducts = products.filter(product =>
                product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const filteredCategories = [
                ...topCategories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase())),
                ...parentCategories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase())),
                ...childCategories.filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase())),
            ];

            console.log("Filtered products:", filteredProducts);
            console.log("Filtered categories:", filteredCategories);

            setFilteredProducts(filteredProducts);
            setFilteredCategories(filteredCategories);
        }
    }, [searchTerm, products, topCategories, parentCategories, childCategories]);

    const handleSearchChange = (event) => {
        console.log("Search term updated:", event.target.value);
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
        searchInputRef.current.focus();
    };

    useEffect(() => {
        const searchModal = document.getElementById('searchModal');
        const nonModalElements = Array.from(document.body.children).filter(
            (el) => el !== searchModal
        );

        const setAriaHidden = (hidden) => {
            nonModalElements.forEach((el) => el.setAttribute('aria-hidden', hidden));
        };

        const handleModalShow = () => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
                if (searchTerm) {
                    searchInputRef.current.select();
                }
            }
            // Set aria-hidden on non-modal elements
            setAriaHidden('true');
        };

        const handleModalHide = () => {
            // Remove aria-hidden from non-modal elements
            setAriaHidden('false');
        };

        searchModal.addEventListener('shown.bs.modal', handleModalShow);
        searchModal.addEventListener('hidden.bs.modal', handleModalHide);

        return () => {
            searchModal.removeEventListener('shown.bs.modal', handleModalShow);
            searchModal.removeEventListener('hidden.bs.modal', handleModalHide);
        };
    }, [searchTerm]);


    return (
        <div className="modal fade search-modal" id="searchModal" tabIndex="-1" aria-labelledby="searchModalLabel" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-xl search-modal-dialog">
                <div className="modal-content search-modal-content">
                    <div className="modal-header search-modal-header">
                        <h5 className="modal-title search-modal-title" id="searchModalLabel">Search</h5>
                        <button type="button" className="btn-close search-btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body search-modal-body">
                        <div className='search-box-wrapper position-relative'>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Search for a product or category..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                ref={searchInputRef}
                                name='searchBox'
                            />
                            {searchTerm && (
                                <i
                                    className="ri-close-line position-absolute cursor-pointer"
                                    onClick={clearSearch}
                                ></i>
                            )}
                        </div>

                        {filteredCategories.length > 0 && (
                            <div className="search-category-section border-bottom pb-3 border-2 border-secondary">
                                <h6 className="mt-3">Categories</h6>
                                <ul className="list-group mt-2 search-results-list list-unstyled d-flex flex-row gap-4">
                                    {filteredCategories.map((category) => {
                                        console.log("Filtered category:", category);

                                        let categoryUrl = ""; // Determine URL based on category type
                                        if (category.topCategory) {
                                            // ParentCategory
                                            categoryUrl = `/parentcat/${category._id}`;
                                            console.log(`ParentCategory URL: ${categoryUrl}`);
                                        } else if (category.parent) {
                                            // ChildCategory
                                            categoryUrl = `/childcat/${category._id}`;
                                            console.log(`ChildCategory URL: ${categoryUrl}`);
                                        } else {
                                            // TopCategory
                                            categoryUrl = `/${category.name.toLowerCase().replace(/\s+/g, '-')}`;
                                            console.log(`TopCategory URL: ${categoryUrl}`);
                                        }

                                        return (
                                            <li key={category._id} className="search-result-item">
                                                <Link to={categoryUrl} className="text-decoration-none search-result-link" data-bs-dismiss="modal">
                                                    <div className='cat-name px-1'>{category.name}</div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {filteredProducts.length > 0 && (
                            <div className="search-product-section">
                                <h6 className="mt-3">Products</h6>
                                <div className="row row-cols-2 row-cols-md-5 g-lg-4 search-results-list">
                                    {filteredProducts.map(product => (
                                        <div key={product.id} className="search-result-item">
                                            <div className="itemnew">
                                                <Link to={`/product/${product._id}`} className='mega-card text-decoration-none' data-bs-dismiss="modal">
                                                    <div className="item-image w-100 position-relative overflow-hidden">
                                                        <img src={`${API_URL}/uploads/featured/${product.featuredImage}`} alt={product.itemName} className="w-100" />
                                                        <div className={`best-seller-tag text-uppercase position-absolute`}>{extractTag(product.tag)}</div>
                                                    </div>
                                                    <div className="card-body text-center mt-3 letter-216 py-0 px-1 px-lg-3">
                                                        <h6 className="product-title xs-small-fonts large-fonts">{product.itemName}</h6>
                                                        <div className="product-price">
                                                            <div className="item-price-new fw-600 xs-large-fonts fw-bold">
                                                                ${product.newPrice}
                                                            </div>
                                                            <div className="item-price-old text-decoration-line-through xs-large-fonts fw-500">
                                                                ${product.oldPrice}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {filteredCategories.length === 0 && filteredProducts.length === 0 && searchTerm && (
                            <p className="mt-3 search-no-results">No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveSearch;
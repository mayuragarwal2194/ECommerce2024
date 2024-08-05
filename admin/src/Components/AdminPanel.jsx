import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './AdminPanel.css';
import AddParentCategory from './Categories/ParentCategory/AddParentCategory';
import ViewParentCategories from './Categories/ParentCategory/viewParentCategory';
import AddChildCategory from './Categories/ChildCategory/AddChildCategory';
import ViewChildCategory from './Categories/ChildCategory/ViewChildCategory';
import ProductForm from './ProductForm/ProductForm';
import ViewProducts from './ViewProduct/ViewProduct';
import { getAllProducts, getParentCategories, getChildCategories } from '../Services/api';
import AddTopCategory from './Categories/TopCategory/AddTopCategory';
import ViewTopCategory from './Categories/TopCategory/ViewTopCategory';

const AdminPanel = ({ activeTab: initialTab }) => {
  const [products, setProducts] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const { productId, categoryId } = useParams();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
    if (parentCategories.length === 0) fetchParentCategories();
    if (childCategories.length === 0) fetchChildCategories();

    if (productId) {
      setActiveTab('editProduct');
    } else if (categoryId) {
      if (categoryId.startsWith('p')) {
        setActiveTab('editParentCategory');
      } else {
        setActiveTab('editChildCategory');
      }
    }
  }, [productId, categoryId, products.length, parentCategories.length, childCategories.length]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const data = await getParentCategories();
      setParentCategories(data);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const fetchChildCategories = async () => {
    try {
      const data = await getChildCategories();
      setChildCategories(data);
    } catch (error) {
      console.error('Error fetching child categories:', error);
    }
  };

  return (
    <div>
      {activeTab === 'addProduct' && (
        <ProductForm fetchProducts={fetchProducts} />
      )}
      {activeTab === 'editProduct' && (
        <ProductForm fetchProducts={fetchProducts} productId={productId} />
      )}
      {activeTab === 'viewProducts' && (
        <ViewProducts products={products} fetchProducts={fetchProducts} />
      )}
      {activeTab === 'addTopCategory' && (
        <AddTopCategory />
      )}
      {activeTab === 'viewTopCategory' && (
        <ViewTopCategory />
      )}
      {activeTab === 'addParentCategory' && (
        <AddParentCategory />
      )}
      {activeTab === 'editParentCategory' && (
        <AddParentCategory />
      )}
      {activeTab === 'viewParentCategories' && (
        <ViewParentCategories
          categories={parentCategories}
          fetchCategories={fetchParentCategories}
        />
      )}
      {activeTab === 'addChildCategory' && (
        <AddChildCategory fetchCategories={fetchChildCategories} />
      )}
      {activeTab === 'editChildCategory' && (
        <AddParentCategory fetchCategories={fetchChildCategories} categoryToEdit={location.state?.category} />
      )}
      {activeTab === 'viewChildCategories' && (
        <ViewChildCategory
          categories={childCategories}
          fetchCategories={fetchChildCategories}
        />
      )}
    </div>
  );
};

export default AdminPanel;
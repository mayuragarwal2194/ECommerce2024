import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="list-group mb-3">
      <NavLink 
        to="/" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        Add Product
      </NavLink>
      <NavLink 
        to="/viewproduct" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        View Products
      </NavLink>
      <NavLink 
        to="/addtopcategory" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        Add Top Category
      </NavLink>
      <NavLink 
        to="/viewtopcategory" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        View Top Category
      </NavLink>
      <NavLink 
        to="/parentcategories/add" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        Add Parent Category
      </NavLink>
      <NavLink 
        to="/parentcategories/view" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        View Parent Categories
      </NavLink>
      <NavLink 
        to="/childcategories/add" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        Add Child Category
      </NavLink>
      <NavLink 
        to="/childcategories/view" 
        className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
      >
        View Child Categories
      </NavLink>
    </div>
  );
};

export default AdminSidebar;
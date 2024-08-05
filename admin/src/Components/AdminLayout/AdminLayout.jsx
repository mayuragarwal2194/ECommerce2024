import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="container-fluid my-5 adminpanel">
      <h1 className="text-center mb-5">Admin Panel</h1>
      <div className="row">
        <div className="col-md-3">
          <AdminSidebar />
        </div>
        <div className="col-md-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

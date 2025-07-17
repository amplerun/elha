import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">
            <h3>Admin Panel</h3>
            <nav>
                <NavLink end to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
                <NavLink to="/admin/sellers" className={({ isActive }) => isActive ? 'active' : ''}>Manage Sellers</NavLink>
                <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'active' : ''}>Manage Categories</NavLink>
                {/* These are placeholders for future features from the screenshots */}
                <a href="#!" className="disabled">Theme Editor</a>
                <a href="#!" className="disabled">Site Settings</a>
            </nav>
        </div>
    );
};

export default AdminSidebar;
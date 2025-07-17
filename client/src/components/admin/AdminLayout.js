import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
    // This component will ensure only admins can see these pages,
    // although the route itself provides the primary protection.
    const { user } = useSelector(state => state.auth);

    if (!user || user.role !== 'admin') {
        return <h2>Not Authorized</h2>;
    }

    return (
        <div style={{ display: 'flex', backgroundColor: '#f4f6f9' }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
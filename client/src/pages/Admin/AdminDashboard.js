import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/admin/users" className="btn">Manage Users</Link>
                <Link to="/admin/orders" className="btn">Manage Orders</Link>
                <Link to="/admin/stores" className="btn">Manage Stores</Link>
            </div>
        </div>
    );
}
export default AdminDashboard;
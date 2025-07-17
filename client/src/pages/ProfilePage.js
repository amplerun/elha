import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../features/orders/orderSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProfilePage() {
    // --- 1. HOOKS AT TOP LEVEL ---
    const dispatch = useDispatch();
    const { myOrders = [], loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    // --- 2. RENDER LOGIC ---
    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;

    return (
        <div>
            <h2>My Orders</h2>
            <table>
                {/* ... table JSX ... */}
            </table>
        </div>
    );
}
export default ProfilePage;
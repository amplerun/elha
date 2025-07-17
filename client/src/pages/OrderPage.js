import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, resetOrder } from '../features/orders/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function OrderPage() {
    // --- 1. HOOKS AT TOP LEVEL ---
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
        return () => { dispatch(resetOrder()); };
    }, [dispatch, orderId, order]);

    // --- 2. RENDER LOGIC ---
    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!order) return <Message>Order not found.</Message>;

    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

    return (
        <div>
            <h1>Order Details: {order._id}</h1>
            {/* ... Rest of JSX ... */}
        </div>
    );
}
export default OrderPage;
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, resetOrder } from '../../features/orders/orderSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function OrderPage() {
    // 1. ALL HOOKS AT THE TOP
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
        return () => { dispatch(resetOrder()); };
    }, [dispatch, orderId, order]);

    // 2. EARLY RETURNS AFTER HOOKS
    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!order) return <Message>Order not found.</Message>;

    // 3. RENDER LOGIC
    return (
        <div>
            <h1>Order Details: {order._id}</h1>
            {/* JSX content... */}
        </div>
    );
}
export default OrderPage;
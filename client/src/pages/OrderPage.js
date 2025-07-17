import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, resetOrder } from '../../features/orders/orderSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function OrderPage() {
    // --- HOOKS AT THE TOP LEVEL ---
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);

    // --- EFFECT HOOK ---
    useEffect(() => {
        // Fetch details when the component mounts or orderId changes.
        // We also check if the currently loaded order is the correct one.
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }

        // Cleanup function to reset the order state when the component unmounts
        return () => {
            dispatch(resetOrder());
        };
    }, [dispatch, orderId, order]);

    // --- RENDER LOGIC ---
    // Helper function for consistent formatting
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

    // Main render logic with guard clauses
    if (loading) return <Loader />;
    if (error) return <Message variant="danger">{error}</Message>;
    if (!order) return <Message>Order not found.</Message>; // Guard for when order is null

    return (
        <div>
            <h1>Order Details</h1>
            <p><strong>Order ID:</strong> {order._id}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <h2>Shipping Information</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                        <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                        <div><strong>Status:</strong> {order.isDelivered ? <Message variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message> : <Message variant="danger">Not Delivered</Message>}</div>
                    </div>
                    <hr />
                    <div style={{ marginTop: '1rem' }}>
                        <h2>Payment Information</h2>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <div><strong>Status:</strong> {order.isPaid ? <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message> : <Message variant="danger">Not Paid</Message>}</div>
                    </div>
                    <hr />
                    <div style={{ marginTop: '1rem' }}>
                        <h2>Order Items</h2>
                        {order.orderItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '1rem' }} />
                                <Link to={`/product/${item.product}`} style={{ flex: 1 }}>{item.name}</Link>
                                <div>{item.qty} x ${addDecimals(item.price)} = ${addDecimals(item.qty * item.price)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px' }}>
                        <h2>Order Summary</h2>
                        <p style={{display: 'flex', justifyContent: 'space-between'}}><span>Items:</span> <span>${addDecimals(order.itemsPrice)}</span></p>
                        <p style={{display: 'flex', justifyContent: 'space-between'}}><span>Shipping:</span> <span>${addDecimals(order.shippingPrice)}</span></p>
                        <p style={{display: 'flex', justifyContent: 'space-between'}}><span>Tax:</span> <span>${addDecimals(order.taxPrice)}</span></p>
                        <hr />
                        <p style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}><span>Total:</span> <span>${addDecimals(order.totalPrice)}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPage;
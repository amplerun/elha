import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../features/orders/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

function OrderPage() {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        if (!order || order._id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, orderId, order]);

    return loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : !order ? null : (
        <div>
            <h1>Order {order._id}</h1>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
            <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <div>
                <h2>Order Items</h2>
                {order.orderItems.map((item, index) => (
                    <div key={index}>
                        <Link to={`/product/${item.product}`}>{item.name}</Link> ({item.qty} x ${item.price} = ${item.qty * item.price})
                    </div>
                ))}
            </div>
            <h2>Total Price: ${order.totalPrice}</h2>
            <div><strong>Delivered:</strong> {order.isDelivered ? <Message variant="success">Delivered on {order.deliveredAt}</Message> : <Message variant="danger">Not Delivered</Message>}</div>
        </div>
    );
}
export default OrderPage;
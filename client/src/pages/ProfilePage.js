import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../features/orders/orderSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

function ProfilePage() {
    const dispatch = useDispatch();
    const { myOrders, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    return (
        <div>
            <h2>My Orders</h2>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <table>
                    <thead>
                        <tr><th>ID</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>DELIVERED</th><th></th></tr>
                    </thead>
                    <tbody>
                        {myOrders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? 'Yes' : 'No'}</td>
                                <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                                <td><Link to={`/order/${order._id}`} className="btn btn-sm btn-light">Details</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default ProfilePage;
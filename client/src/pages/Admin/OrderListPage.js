import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../../features/admin/adminSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function OrderListPage() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(listOrders());
    }, [dispatch]);

    return (
        <div>
            <h1>All Orders</h1>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <table>
                    <thead>
                        <tr><th>ID</th><th>USER</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>DELIVERED</th><th></th></tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
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
export default OrderListPage;
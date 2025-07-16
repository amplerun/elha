import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listStores, updateStoreStatus } from '../../features/admin/adminSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function StoreListPage() {
    const dispatch = useDispatch();
    const { stores = [], loading, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(listStores());
    }, [dispatch]);

    const handleStatusUpdate = (storeId, status) => {
        if (window.confirm(`Are you sure you want to ${status} this store?`)) {
            dispatch(updateStoreStatus({ storeId, status }));
        }
    };

    return (
        <div>
            <h1>All Stores</h1>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <table>
                    <thead>
                        <tr><th>ID</th><th>NAME</th><th>OWNER</th><th>STATUS</th><th>ACTIONS</th></tr>
                    </thead>
                    <tbody>
                        {stores && stores.length > 0 ? (
                            stores.map(store => (
                                <tr key={store._id}>
                                    <td>{store._id}</td>
                                    <td>{store.name}</td>
                                    <td>{store.owner && store.owner.name}</td>
                                    <td>{store.status}</td>
                                    <td>
                                        {store.status === 'pending' && (
                                            <>
                                                <button className="btn btn-sm" onClick={() => handleStatusUpdate(store._id, 'approved')}>Approve</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(store._id, 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>No stores found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default StoreListPage;
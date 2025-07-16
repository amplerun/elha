import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyStore, createOrUpdateStore } from '../../features/store/storeSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

function SellerDashboard() {
    const dispatch = useDispatch();
    const { myStore, loading, error } = useSelector(state => state.store);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        dispatch(getMyStore());
    }, [dispatch]);

    useEffect(() => {
        if (myStore) {
            setName(myStore.name);
            setDescription(myStore.description);
        }
    }, [myStore]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createOrUpdateStore({ name, description, logo: '/uploads/images/sample-logo.png' })); // Placeholder logo
    };

    return (
        <div>
            <h1>Seller Dashboard</h1>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/seller/products" className="btn">Manage My Products</Link>
            </div>
            <h2>My Store Details</h2>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                myStore && myStore.status === 'approved' ? (
                    <Message variant="success">Your store "{myStore.name}" is approved and live.</Message>
                ) : myStore && myStore.status === 'pending' ? (
                    <Message>Your store is pending approval.</Message>
                ) : myStore && myStore.status === 'rejected' ? (
                    <Message variant="danger">Your store application was rejected.</Message>
                ) : null
            )}
            <form onSubmit={submitHandler} className="form-container" style={{ margin: '2rem 0' }}>
                <div className="form-group"><label>Store Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="form-group"><label>Store Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <button type="submit" className="btn">{myStore ? 'Update Store' : 'Create Store'}</button>
            </form>
        </div>
    );
}
export default SellerDashboard;
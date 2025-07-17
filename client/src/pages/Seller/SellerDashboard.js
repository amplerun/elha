import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyStore, createOrUpdateStore } from '../../features/store/storeSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import FileUpload from '../../components/FileUpload';

function SellerDashboard() {
    // --- HOOKS AT THE TOP LEVEL ---
    const dispatch = useDispatch();
    const { myStore, loading, error } = useSelector(state => state.store);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState('');

    // --- EFFECT HOOKS ---
    useEffect(() => {
        // Fetch store data when component mounts
        dispatch(getMyStore());
    }, [dispatch]);

    useEffect(() => {
        // Populate form fields once store data is loaded
        if (myStore) {
            setName(myStore.name || '');
            setDescription(myStore.description || '');
            setLogo(myStore.logo || '');
        }
    }, [myStore]);

    // --- EVENT HANDLERS ---
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createOrUpdateStore({ name, description, logo }));
    };
    
    // --- RENDER LOGIC (Conditional returns are after hooks) ---
    return (
        <div>
            <h1>Seller Dashboard</h1>
            <p style={{ color: '#6c757d' }}>Manage your storefront and view your sales performance.</p>

            <div style={{ margin: '2rem 0', display: 'flex', gap: '1rem' }}>
                <Link to="/seller/products" className="btn">Manage My Products</Link>
                {/* Placeholder for future features */}
                <button className="btn btn-light" disabled>View Orders</button>
            </div>

            <h2>My Store Details</h2>
            {loading && !myStore ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <>
                    {myStore && myStore.status === 'approved' ? (
                        <Message variant="success">Your store "{myStore.name}" is approved and live.</Message>
                    ) : myStore && myStore.status === 'pending' ? (
                        <Message>Your store application is pending approval by an admin.</Message>
                    ) : myStore && myStore.status === 'rejected' ? (
                        <Message variant="danger">Your store application was rejected. Please contact support.</Message>
                    ) : (
                        <Message>You have not created a store yet. Fill out the form below to apply.</Message>
                    )}
                    
                    <form onSubmit={submitHandler} className="form-container" style={{ margin: '2rem 0', padding: '1.5rem' }}>
                        <div className="form-group">
                            <label>Store Name</label>
                            <input type="text" placeholder="e.g., Dave's Gadgets" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Store Description</label>
                            <textarea placeholder="Describe what your store sells" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Store Logo</label>
                            <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Enter image URL or upload" />
                            <FileUpload onUploadSuccess={(url) => setLogo(url)} />
                            {logo && <img src={logo} alt="Store Logo Preview" style={{ width: '100px', marginTop: '10px' }} />}
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Saving...' : (myStore ? 'Update Store Application' : 'Create Store')}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default SellerDashboard;